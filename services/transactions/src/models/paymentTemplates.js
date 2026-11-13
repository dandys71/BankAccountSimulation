import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { templates, payments } from "../db/schemas/index.js";
import { Payments } from "./payments.js";

/** Šablona instituce + napojená Platba (FG_Entity_DB). */
export const PaymentTemplates = {
  async create(data) {
    let paymentId = data.paymentId;
    if (!paymentId) {
      const payment = await Payments.create({
        paymentType: data.type === "income" || data.paymentType === "PRIJEM" ? "PRIJEM" : "VYDAJ",
        amountType:
          data.amountType === "random" || data.amountType === "NAHODNA"
            ? "NAHODNA"
            : "PEVNA_CASTKA",
        amount: data.fixedAmount ?? data.amount ?? null,
        minAmount: data.amountMin ?? data.minAmount ?? null,
        maxAmount: data.amountMax ?? data.maxAmount ?? null,
        intervalDays: data.intervalDays ?? 30,
        currency: data.currency || "CZK",
      });
      paymentId = payment.paymentId;
    }

    const item = {
      templateId: data.templateId || `tpl_${crypto.randomUUID()}`,
      institutionId: data.institutionId,
      name: data.name,
      paymentId,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    };
    await db.insert(templates).values(item);
    return item;
  },

  async get(templateId) {
    const rows = await db
      .select()
      .from(templates)
      .where(eq(templates.templateId, templateId));
    return rows[0] ?? null;
  },

  async update(templateId, data) {
    const result = await db
      .update(templates)
      .set(data)
      .where(eq(templates.templateId, templateId))
      .returning();
    return result[0] ?? null;
  },

  async delete(templateId) {
    const result = await db
      .delete(templates)
      .where(eq(templates.templateId, templateId))
      .returning();
    return result[0] ?? null;
  },

  async list(filters = {}) {
    const conditions = [];
    if (filters.institutionId) {
      conditions.push(eq(templates.institutionId, filters.institutionId));
    }
    if (typeof filters.active !== "undefined") {
      conditions.push(eq(templates.isActive, Boolean(filters.active)));
    }
    return db
      .select()
      .from(templates)
      .where(conditions.length ? and(...conditions) : undefined);
  },

  async listWithPayments(filters = {}) {
    const items = await this.list(filters);
    const enriched = [];
    for (const item of items) {
      const paymentRows = await db
        .select()
        .from(payments)
        .where(eq(payments.paymentId, item.paymentId));
      enriched.push({ ...item, payment: paymentRows[0] ?? null });
    }
    return enriched;
  },
};
