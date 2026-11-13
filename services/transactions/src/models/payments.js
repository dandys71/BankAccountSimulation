import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { payments } from "../db/schemas/index.js";

export const Payments = {
  async create(data) {
    const item = {
      paymentId: data.paymentId || `pay_${crypto.randomUUID()}`,
      paymentType: data.paymentType, // PRIJEM | VYDAJ
      amountType: data.amountType, // NAHODNA | PEVNA_CASTKA
      amount: data.amount ?? null,
      minAmount: data.minAmount ?? null,
      maxAmount: data.maxAmount ?? null,
      intervalDays: data.intervalDays ?? 30,
      currency: data.currency || "CZK",
      createdAt: new Date(),
    };
    await db.insert(payments).values(item);
    return item;
  },

  async get(paymentId) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.paymentId, paymentId));
    return rows[0] ?? null;
  },

  async resolveAmount(paymentId) {
    const payment = await this.get(paymentId);
    if (!payment) return null;
    if (payment.amountType === "PEVNA_CASTKA") {
      return payment.amount ?? 0;
    }
    const min = payment.minAmount ?? 0;
    const max = payment.maxAmount ?? min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
