import { StandingOrder } from "../models/standingOrder.js";
import { runNow as runStandingOrderNow } from "./standingOrderService.js";
import { getAllSavingAccounts, applyInterest } from "../models/savingAccounts.js";
import { SimulationSettings } from "../models/simulationSettings.js";
import { Accounts } from "../models/accounts.js";
import * as TransactionModel from "../models/transactions.js";

const TICK_MS = Number(process.env.CRON_TICK_MS || 60_000);
let timer = null;
let lastPayrollAt = 0;

export async function runDueStandingOrders(asOf = new Date()) {
  const orders = await StandingOrder.list({ active: true });
  const due = orders.filter((order) => {
    if (!order.nextRunAt) return false;
    return new Date(order.nextRunAt).getTime() <= asOf.getTime();
  });

  const results = [];
  for (const order of due) {
    try {
      const txs = await runStandingOrderNow(order.standingOrderId, asOf.toISOString());
      // posuň nextRunAt podle intervalu
      const next = new Date(asOf);
      if (order.interval === "weekly") next.setDate(next.getDate() + 7);
      else if (order.interval === "daily") next.setDate(next.getDate() + 1);
      else next.setMonth(next.getMonth() + 1);
      await StandingOrder.update({
        standingOrderId: order.standingOrderId,
        nextRunAt: next,
      });
      results.push({ standingOrderId: order.standingOrderId, ok: true, txs });
    } catch (err) {
      results.push({
        standingOrderId: order.standingOrderId,
        ok: false,
        error: err.message,
      });
    }
  }
  return results;
}

export async function runInterestBatch(asOf = new Date()) {
  const accounts = await getAllSavingAccounts();
  const results = [];
  for (const acc of accounts) {
    if (acc.isClosed) continue;
    try {
      const result = await applyInterest(
        acc.institutionId,
        acc.id,
        asOf.toISOString().slice(0, 10),
        "execute"
      );
      results.push(result);
    } catch (err) {
      results.push({ accountId: acc.id, error: err.message });
    }
  }
  return results;
}

export async function runPayrollOnce() {
  const settings = await SimulationSettings.get();
  if (!settings?.payrollEnabled) {
    return { skipped: true, reason: "payroll disabled" };
  }
  const amount = Number(settings.payrollAmount || 0);
  if (amount <= 0) {
    return { skipped: true, reason: "payroll amount is 0" };
  }

  // Vyplata na všechny aktivní běžné účty (výukové zjednodušení).
  const accounts = await Accounts.listByUser(undefined, { page: 1, pageSize: 500 });
  const postedAt = settings.currentSimTime
    ? new Date(settings.currentSimTime)
    : new Date();
  const created = [];

  for (const acc of accounts) {
    if (!acc.isActive) continue;
    const tx = await TransactionModel.create({
      fromAccountId: "PAYROLL",
      toAccountId: acc.accountId,
      accountId: acc.accountId,
      counterpartyAccount: "MZDA",
      amount,
      currency: acc.currency,
      direction: "INCOMING",
      status: "COMPLETED",
      comment: "Výplata",
      note: "Automatická mzda",
      postedAt,
      simulatedAt: postedAt,
    });
    await Accounts.adjustBalance(acc.accountId, amount);
    created.push(tx.transactionId);
  }

  lastPayrollAt = Date.now();
  return { created: created.length, transactionIds: created, amount };
}

async function tick() {
  try {
    const settings = await SimulationSettings.get();
    const asOf = settings?.currentSimTime
      ? new Date(settings.currentSimTime)
      : new Date();

    // posun fiktivního času podle speedFactor (1 = real-time minuta = 1 sim minuta)
    if (settings?.speedFactor && settings.speedFactor > 1) {
      const advanceMs = (settings.speedFactor - 1) * TICK_MS;
      const next = new Date(asOf.getTime() + advanceMs);
      await SimulationSettings.update({ currentSimTime: next });
    }

    const so = await runDueStandingOrders(asOf);
    if (so.length) {
      console.log(`[cron] standing orders: ${so.length}`);
    }

    if (settings?.payrollEnabled) {
      const intervalMin = Number(settings.payrollIntervalMinutes || 30);
      if (Date.now() - lastPayrollAt >= intervalMin * 60_000) {
        const payroll = await runPayrollOnce();
        console.log("[cron] payroll", payroll);
      }
    }
  } catch (err) {
    console.error("[cron] tick failed", err.message);
  }
}

export function startCron() {
  if (timer) return;
  console.log(`⏱️  Cron běží každých ${TICK_MS / 1000}s`);
  timer = setInterval(tick, TICK_MS);
  // první tick až po krátké pauze, ať nestartuje dřív než DB
  setTimeout(tick, 5_000);
}
