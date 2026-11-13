import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { savingsAccounts } from "../db/schemas/index.js";
import { Accounts } from "./accounts.js";
import * as TransactionModel from "./transactions.js";

export async function getAllSavingAccounts() {
  return db.select().from(savingsAccounts);
}

export async function findById(id) {
  const rows = await db
    .select()
    .from(savingsAccounts)
    .where(eq(savingsAccounts.id, id));
  return rows[0] ?? null;
}

export async function find(predicate) {
  const all = await getAllSavingAccounts();
  return all.find(predicate) ?? null;
}

export async function getBalance(id) {
  const acc = await findById(id);
  if (!acc) return null;
  return { id: acc.id, balance: acc.balance };
}

export async function getHistory(id) {
  const acc = await findById(id);
  if (!acc) return null;
  return TransactionModel.listByAccount(id);
}

export async function getInterestSettings(id) {
  const acc = await findById(id);
  if (!acc) return null;
  return { id: acc.id, interestRate: acc.interestRate };
}

export async function createSavingAccount(data) {
  const id = data.id || `sa_${crypto.randomUUID()}`;
  const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();

  const account = {
    id,
    userId: data.userId,
    institutionId: data.institutionId || "bank_0100",
    accountNumber: data.accountNumber || `SA-${Date.now()}`,
    name: data.name || "Spořicí účet",
    currency: data.currency || "CZK",
    balance: data.balance ?? 0,
    interestRate: data.interestRate ?? 0,
    isClosed: false,
    createdAt,
    closedAt: null,
    lastInterestAppliedAt: null,
  };

  await db.insert(savingsAccounts).values(account);
  return account;
}

export async function updateSavingAccount(id, data) {
  const existing = await findById(id);
  if (!existing) return null;

  const { id: _ignore, createdAt: _c, ...rest } = data;
  const result = await db
    .update(savingsAccounts)
    .set(rest)
    .where(eq(savingsAccounts.id, id))
    .returning();

  return result[0] ?? null;
}

export async function closeSavingAccount(id) {
  const result = await db
    .update(savingsAccounts)
    .set({ isClosed: true, closedAt: new Date() })
    .where(eq(savingsAccounts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function applyInterest(institutionId, accountId, asOf, mode) {
  const acc = await findById(accountId);
  if (!acc) return null;

  const interestRate = acc.interestRate / 100 / 12;
  const interest = Math.round(acc.balance * interestRate);

  if (mode === "execute") {
    const updated = await db
      .update(savingsAccounts)
      .set({
        balance: acc.balance + interest,
        lastInterestAppliedAt: asOf ? new Date(asOf) : new Date(),
      })
      .where(eq(savingsAccounts.id, accountId))
      .returning();

    return {
      institutionId,
      accountId,
      asOf,
      interest,
      newBalance: updated[0].balance,
    };
  }

  return {
    institutionId,
    accountId,
    asOf,
    interest,
    newBalance: acc.balance,
  };
}

export async function transferToCurrent(savingId, currentAccountId, amount) {
  const saving = await findById(savingId);
  if (!saving) return null;

  const current = await Accounts.findById(currentAccountId);
  if (!current) return null;

  if (saving.balance < amount) {
    return "INSUFFICIENT_FUNDS";
  }

  await db
    .update(savingsAccounts)
    .set({ balance: saving.balance - amount })
    .where(eq(savingsAccounts.id, savingId));

  await Accounts.adjustBalance(currentAccountId, amount);

  await TransactionModel.create({
    accountId: savingId,
    counterpartyAccount: currentAccountId,
    amount,
    currency: saving.currency,
    direction: "OUTGOING",
    status: "COMPLETED",
    note: "Převod ze spoření na běžný účet",
    postedAt: new Date(),
  });

  await TransactionModel.create({
    accountId: currentAccountId,
    counterpartyAccount: savingId,
    amount,
    currency: current.currency,
    direction: "INCOMING",
    status: "COMPLETED",
    note: "Převod ze spořicího účtu",
    postedAt: new Date(),
  });

  const updatedSaving = await findById(savingId);
  const updatedCurrent = await Accounts.findById(currentAccountId);

  return { from: updatedSaving, to: updatedCurrent };
}

export async function transferFromCurrent(savingId, currentAccountId, amount) {
  const saving = await findById(savingId);
  if (!saving || saving.isClosed) return null;

  const current = await Accounts.findById(currentAccountId);
  if (!current || !current.isActive) return null;

  if (current.balance < amount) {
    return "INSUFFICIENT_FUNDS";
  }

  await Accounts.adjustBalance(currentAccountId, -amount);
  await db
    .update(savingsAccounts)
    .set({ balance: saving.balance + amount })
    .where(eq(savingsAccounts.id, savingId));

  await TransactionModel.create({
    accountId: currentAccountId,
    counterpartyAccount: savingId,
    amount,
    currency: current.currency,
    direction: "OUTGOING",
    status: "COMPLETED",
    note: "Převod na spořicí účet",
    postedAt: new Date(),
  });

  await TransactionModel.create({
    accountId: savingId,
    counterpartyAccount: currentAccountId,
    amount,
    currency: saving.currency,
    direction: "INCOMING",
    status: "COMPLETED",
    note: "Vklad z běžného účtu",
    postedAt: new Date(),
  });

  return {
    from: await Accounts.findById(currentAccountId),
    to: await findById(savingId),
  };
}
