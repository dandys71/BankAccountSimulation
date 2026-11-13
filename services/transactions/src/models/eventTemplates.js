import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { fates } from "../db/schemas/index.js";
import { Payments } from "./payments.js";

/** Osud (FG_Entity_DB) — náhodný příjem/výdaj napojený na PlatbaID. */
export const EventTemplates = {
  async create(data) {
    let paymentId = data.paymentId;
    if (!paymentId) {
      const payment = await Payments.create({
        paymentType: data.type === "income" || data.paymentType === "PRIJEM" ? "PRIJEM" : "VYDAJ",
        amountType:
          data.amountType === "fixed" || data.amountType === "PEVNA_CASTKA"
            ? "PEVNA_CASTKA"
            : "NAHODNA",
        amount: data.fixedAmount ?? data.amount ?? null,
        minAmount: data.amountMin ?? data.minAmount ?? 100,
        maxAmount: data.amountMax ?? data.maxAmount ?? 2000,
        intervalDays: data.intervalDays ?? 0,
        currency: data.currency || "CZK",
      });
      paymentId = payment.paymentId;
    }

    const item = {
      fateId: data.fateId || data.eventTemplateId || `evt_${crypto.randomUUID()}`,
      organizationId: data.organizationId || data.institutionId,
      name: data.name,
      description: data.description || data.note || "",
      paymentId,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    };
    await db.insert(fates).values(item);
    return item;
  },

  async get(fateId) {
    const rows = await db.select().from(fates).where(eq(fates.fateId, fateId));
    return rows[0] ?? null;
  },

  async update(fateId, data) {
    const result = await db
      .update(fates)
      .set(data)
      .where(eq(fates.fateId, fateId))
      .returning();
    return result[0] ?? null;
  },

  async delete(fateId) {
    const result = await db.delete(fates).where(eq(fates.fateId, fateId)).returning();
    return result[0] ?? null;
  },

  async list(filters = {}) {
    const conditions = [];
    if (filters.organizationId) {
      conditions.push(eq(fates.organizationId, filters.organizationId));
    }
    if (filters.institutionId) {
      conditions.push(eq(fates.organizationId, filters.institutionId));
    }
    if (typeof filters.active !== "undefined") {
      conditions.push(eq(fates.isActive, Boolean(filters.active)));
    }
    return db
      .select()
      .from(fates)
      .where(conditions.length ? and(...conditions) : undefined);
  },
};

export const Fates = EventTemplates;
