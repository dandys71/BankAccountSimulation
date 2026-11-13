import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { standingOrders } from "../db/schemas/index.js";

function toDate(value) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export const StandingOrder = {
  async create(data) {
    const standingOrderId = `so_${crypto.randomUUID()}`;
    const fromAccountId = data.fromAccountId || data.accountId;
    const item = {
      standingOrderId,
      fromAccountId,
      toAccountId: data.toAccountId || null,
      toAccountNumber: data.toAccountNumber || data.counterpartyAccount || null,
      paymentId: data.paymentId || null,
      templateId: data.templateId || null,
      accountId: data.accountId || fromAccountId,
      counterpartyAccount: data.counterpartyAccount || data.toAccountNumber || null,
      interval: data.interval || null,
      customCron: data.customCron || null,
      dayOfMonth: data.dayOfMonth ?? null,
      amount: data.amount ?? null,
      currency: data.currency || "CZK",
      nextRunAt: toDate(data.nextRunAt),
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    };

    await db.insert(standingOrders).values(item);
    return item;
  },

  async get(standingOrderId) {
    const rows = await db
      .select()
      .from(standingOrders)
      .where(eq(standingOrders.standingOrderId, standingOrderId));
    return rows[0] ?? null;
  },

  async update(data) {
    const { standingOrderId, ...rest } = data;
    if (rest.nextRunAt) rest.nextRunAt = toDate(rest.nextRunAt);
    if (rest.accountId && !rest.fromAccountId) {
      rest.fromAccountId = rest.accountId;
    }

    const result = await db
      .update(standingOrders)
      .set(rest)
      .where(eq(standingOrders.standingOrderId, standingOrderId))
      .returning();

    return result[0] ?? null;
  },

  async delete(standingOrderId) {
    const result = await db
      .delete(standingOrders)
      .where(eq(standingOrders.standingOrderId, standingOrderId))
      .returning();
    return result[0] ?? null;
  },

  async list(filters = {}) {
    const conditions = [];
    if (filters.accountId) {
      conditions.push(eq(standingOrders.accountId, filters.accountId));
    }
    if (typeof filters.active !== "undefined") {
      const active =
        filters.active === true ||
        filters.active === "true" ||
        filters.active === 1 ||
        filters.active === "1";
      conditions.push(eq(standingOrders.isActive, active));
    }

    return db
      .select()
      .from(standingOrders)
      .where(conditions.length ? and(...conditions) : undefined);
  },
};
