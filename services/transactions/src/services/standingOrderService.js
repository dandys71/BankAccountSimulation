import crypto from "crypto";
import { StandingOrder } from "../models/standingOrder.js";
import * as TransactionModel from "../models/transactions.js";
import { Accounts } from "../models/accounts.js";
import { Payments } from "../models/payments.js";

export async function getStandingOrderById(standingOrderId) {
  return StandingOrder.get(standingOrderId);
}

export async function updateStandingOrder(standingOrder) {
  return StandingOrder.update(standingOrder);
}

export async function deleteStandingOrder(standingOrderId) {
  return StandingOrder.delete(standingOrderId);
}

export async function createStandingOrder(standingOrder) {
  return StandingOrder.create(standingOrder);
}

export async function listStandingOrders(filters) {
  return StandingOrder.list(filters);
}

export async function runNow(standingOrderId, asOf) {
  const order = await StandingOrder.get(standingOrderId);
  if (!order) return null;

  const accountId = order.fromAccountId || order.accountId;
  const account = await Accounts.findById(accountId);
  if (!account) {
    const err = new Error("Účet trvalého příkazu neexistuje");
    err.status = 404;
    throw err;
  }

  let amount = order.amount;
  if (order.paymentId) {
    const resolved = await Payments.resolveAmount(order.paymentId);
    if (resolved != null) amount = resolved;
  }
  if (amount == null) {
    const err = new Error("Trvalý příkaz nemá částku ani PlatbaID");
    err.status = 400;
    throw err;
  }
  if (account.balance < amount) {
    const err = new Error("Nedostatečný zůstatek pro trvalý příkaz");
    err.status = 400;
    throw err;
  }

  const postedAt = asOf ? new Date(asOf) : new Date();
  const transaction = await TransactionModel.create({
    transactionId: `tx_${crypto.randomUUID()}`,
    fromAccountId: accountId,
    toAccountId: order.toAccountId || null,
    toAccountNumber: order.toAccountNumber || order.counterpartyAccount || "",
    accountId,
    counterpartyAccount: order.counterpartyAccount || order.toAccountNumber || "",
    amount,
    currency: order.currency || "CZK",
    direction: "OUTGOING",
    status: "COMPLETED",
    note: "Okamžité provedení trvalého příkazu",
    postedAt,
    simulatedAt: postedAt,
  });

  await Accounts.adjustBalance(accountId, -amount);

  return [transaction];
}

export async function previewNextExecutions(standingOrderId, windowDays = 60) {
  const order = await StandingOrder.get(standingOrderId);
  if (!order) return null;

  const start = order.nextRunAt ? new Date(order.nextRunAt) : new Date();
  const items = [];
  const cursor = new Date(start);

  for (let i = 0; i < 2; i++) {
    items.push({
      date: cursor.toISOString().slice(0, 10),
      expectedAmount: order.amount,
    });
    if (order.interval === "weekly") {
      cursor.setDate(cursor.getDate() + 7);
    } else if (order.interval === "daily") {
      cursor.setDate(cursor.getDate() + 1);
    } else {
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  return { items, windowDays };
}
