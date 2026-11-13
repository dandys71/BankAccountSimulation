/**
 * Servisa = aplikační logika nad účty.
 */
import { Accounts } from "../models/accounts.js";
import * as TransactionModel from "../models/transactions.js";
import { StandingOrder } from "../models/standingOrder.js";
import QRCode from "qrcode";

function effectiveUserId(user, fallbackUserId) {
  return user?.userId || user?.id || fallbackUserId;
}

export async function getAccountById(accountId, user) {
  return Accounts.findByIdForUser(accountId, effectiveUserId(user));
}

export async function listAccounts({ userId, page, pageSize }, user) {
  const effectiveUser = effectiveUserId(user, userId);
  const items = await Accounts.listByUser(effectiveUser, { page, pageSize });
  return { items, total: items.length, page, pageSize };
}

export async function createAccount(body, user) {
  return Accounts.create({ ...body, balance: body.balance ?? 0, isActive: true });
}

export async function updateAccount(body, user) {
  return Accounts.update(body);
}

export async function closeAccount({ accountId, closeDate }, user) {
  return Accounts.close(accountId, closeDate);
}

export async function getBalance(accountId, user) {
  const acc = await Accounts.findByIdForUser(accountId, effectiveUserId(user));
  if (!acc) return null;
  return { accountId: acc.accountId, balance: acc.balance, currency: acc.currency };
}

export async function getHistory({ accountId, page = 1, pageSize = 50 }, user) {
  return TransactionModel.listByAccount(accountId, { page, pageSize });
}

export async function getStandingOrders(accountId, user) {
  const acc = await Accounts.findByIdForUser(accountId, effectiveUserId(user));
  if (!acc) return null;
  return StandingOrder.list({ accountId, active: true });
}

export async function generateAccountNumber(user) {
  return Accounts.generateAccountNumber();
}

export async function getQrCode({ accountId, amount, message }, user) {
  const acc = await Accounts.findByIdForUser(accountId, effectiveUserId(user));
  if (!acc) return null;

  const payload = [
    `SPD*1.0`,
    `ACC:${acc.accountNumber}`,
    amount ? `AM:${amount}` : null,
    message ? `MSG:${message}` : null,
  ]
    .filter(Boolean)
    .join("*");

  const url = await QRCode.toDataURL(payload);
  return { pngBase64: url, payload };
}
