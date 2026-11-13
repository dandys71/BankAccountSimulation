import crypto from "crypto";
import { and, eq, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { transactions } from "../db/schemas/index.js";
import { Accounts } from "./accounts.js";

function generateId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function resolveSimulatedAt(value) {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
}

export async function create(data) {
  const fromAccountId = data.fromAccountId || data.accountId;
  const toAccountId = data.toAccountId || null;
  const item = {
    transactionId: data.transactionId || generateId("TXN"),
    fromAccountId,
    toAccountId,
    fromAccountNumber: data.fromAccountNumber || null,
    toAccountNumber: data.toAccountNumber || data.counterpartyAccount || null,
    accountId: data.accountId || fromAccountId,
    counterpartyAccount:
      data.counterpartyAccount || data.toAccountNumber || toAccountId || "",
    amount: data.amount,
    currency: data.currency || "CZK",
    direction: data.direction,
    status: data.status || "PENDING",
    vs: data.vs || "",
    ks: data.ks || "",
    ss: data.ss || "",
    note: data.note || "",
    comment: data.comment || "",
    relatedTransactionId: data.relatedTransactionId || null,
    simulatedAt: resolveSimulatedAt(data.simulatedAt || data.postedAt),
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    postedAt: data.postedAt ? new Date(data.postedAt) : null,
  };

  await db.insert(transactions).values(item);
  return item;
}

export async function createExternal(data) {
  const from = await Accounts.findById(data.fromAccountId);
  if (!from) {
    const err = new Error("Zdrojový účet neexistuje");
    err.status = 404;
    throw err;
  }
  if (!from.isActive) {
    const err = new Error("Zdrojový účet je uzavřený");
    err.status = 400;
    throw err;
  }
  if (from.balance < data.amount) {
    const err = new Error("Nedostatečný zůstatek");
    err.status = 400;
    throw err;
  }

  const status = data.executeImmediately === false ? "PENDING" : "COMPLETED";
  const postedAt = status === "COMPLETED" ? new Date() : null;

  const item = await create({
    fromAccountId: data.fromAccountId,
    fromAccountNumber: from.accountNumber,
    toAccountNumber: data.toAccountNumber,
    accountId: data.fromAccountId,
    counterpartyAccount: data.toAccountNumber,
    amount: data.amount,
    currency: data.currency || from.currency,
    direction: "OUTGOING",
    status,
    vs: data.vs,
    ks: data.ks,
    ss: data.ss,
    note: data.note,
    comment: data.comment,
    postedAt,
    simulatedAt: postedAt,
  });

  if (status === "COMPLETED") {
    await Accounts.adjustBalance(data.fromAccountId, -data.amount);
  }

  return item;
}

export async function createInternal(data) {
  const from = await Accounts.findById(data.fromAccountId);
  const to = await Accounts.findById(data.toAccountId);
  if (!from || !to) {
    const err = new Error("Účet neexistuje");
    err.status = 404;
    throw err;
  }
  if (from.balance < data.amount) {
    const err = new Error("Nedostatečný zůstatek");
    err.status = 400;
    throw err;
  }

  const postedAt = new Date();
  const outgoing = await create({
    fromAccountId: data.fromAccountId,
    toAccountId: data.toAccountId,
    fromAccountNumber: from.accountNumber,
    toAccountNumber: to.accountNumber,
    accountId: data.fromAccountId,
    counterpartyAccount: data.toAccountId,
    amount: data.amount,
    currency: data.currency || from.currency,
    direction: "OUTGOING",
    status: "COMPLETED",
    vs: data.vs,
    note: data.note || "Interní převod",
    comment: data.comment || "",
    postedAt,
    simulatedAt: postedAt,
  });

  const incoming = await create({
    fromAccountId: data.fromAccountId,
    toAccountId: data.toAccountId,
    fromAccountNumber: from.accountNumber,
    toAccountNumber: to.accountNumber,
    accountId: data.toAccountId,
    counterpartyAccount: data.fromAccountId,
    amount: data.amount,
    currency: data.currency || to.currency,
    direction: "INCOMING",
    status: "COMPLETED",
    vs: data.vs,
    note: data.note || "Interní převod",
    comment: data.comment || "",
    relatedTransactionId: outgoing.transactionId,
    postedAt,
    simulatedAt: postedAt,
  });

  await Accounts.adjustBalance(data.fromAccountId, -data.amount);
  await Accounts.adjustBalance(data.toAccountId, data.amount);

  return { outgoing, incoming };
}

export async function findById(transactionId) {
  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.transactionId, transactionId));
  return rows[0] ?? null;
}

export async function listByAccount(accountId, { page = 1, pageSize = 50 } = {}) {
  const offset = (page - 1) * pageSize;
  const items = await db
    .select()
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .orderBy(desc(transactions.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { items, total: items.length, page, pageSize };
}

export async function list(filters = {}) {
  const page = Number(filters.page) || 1;
  const pageSize = Number(filters.pageSize) || 50;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.accountId) conditions.push(eq(transactions.accountId, filters.accountId));
  if (filters.status) conditions.push(eq(transactions.status, filters.status));

  const items = await db
    .select()
    .from(transactions)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(transactions.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { items, total: items.length, page, pageSize };
}

export async function listPending(accountId) {
  const conditions = [eq(transactions.status, "PENDING")];
  if (accountId) conditions.push(eq(transactions.accountId, accountId));

  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.createdAt));
}

export async function cancelPending(transactionId) {
  const existing = await findById(transactionId);
  if (!existing) return null;
  if (existing.status !== "PENDING") {
    const err = new Error("Lze zrušit jen čekající platbu");
    err.status = 400;
    throw err;
  }

  const result = await db
    .update(transactions)
    .set({ status: "CANCELLED" })
    .where(eq(transactions.transactionId, transactionId))
    .returning();

  return result[0] ?? null;
}

export async function refund(transactionId, note) {
  const original = await findById(transactionId);
  if (!original) return null;
  if (original.status !== "COMPLETED") {
    const err = new Error("Refundovat lze jen dokončenou transakci");
    err.status = 400;
    throw err;
  }

  const refundDelta = original.direction === "OUTGOING" ? original.amount : -original.amount;
  await Accounts.adjustBalance(original.accountId, refundDelta);

  const result = await db
    .update(transactions)
    .set({
      status: "REFUNDED",
      note: note || original.note || "Reversal / Refund",
    })
    .where(eq(transactions.transactionId, transactionId))
    .returning();

  return result[0] ?? null;
}

export function createStatementObject(data) {
  return {
    accountId: data.accountId,
    format: data.format || "PDF",
    from: data.from,
    to: data.to,
    url: null,
    message: "Výpis bude generován z tabulky transactions (export zatím není implementovaný)",
    createdAt: new Date().toISOString(),
  };
}

export const createTransactionObject = async (data, type = "external") => {
  if (type === "internal") return createInternal(data);
  return createExternal(data);
};

export const createTransactionDetailObject = findById;
export const createTransactionListObject = list;
export const createRefundObject = refund;
export const createPendingTransactionObject = listPending;
export const createCancelledTransactionObject = cancelPending;
