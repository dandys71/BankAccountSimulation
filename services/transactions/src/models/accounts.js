/**
 * Běžné účty — PostgreSQL přes Drizzle.
 */
import crypto from "crypto";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { accounts, accountCounters } from "../db/schemas/index.js";

export const Accounts = {
  async create(data) {
    const accountId = `acc_${crypto.randomUUID()}`;
    const createdAt = new Date();

    const item = {
      accountId,
      userId: data.userId,
      institutionId: data.institutionId,
      accountNumber: data.accountNumber || (await Accounts.generateAccountNumber()).accountNumber,
      name: data.name || "Můj účet",
      currency: data.currency || "CZK",
      balance: data.balance ?? 0,
      isActive: true,
      createdAt,
      closeDate: null,
    };

    await db.insert(accounts).values(item);
    return item;
  },

  async update({ accountId, ...rest }) {
    const result = await db
      .update(accounts)
      .set(rest)
      .where(eq(accounts.accountId, accountId))
      .returning();

    return result[0] ?? null;
  },

  async close(accountId, closeDate) {
    const result = await db
      .update(accounts)
      .set({
        isActive: false,
        closeDate: closeDate || new Date().toISOString().slice(0, 10),
      })
      .where(eq(accounts.accountId, accountId))
      .returning();

    return result[0] ?? null;
  },

  async findById(accountId) {
    const result = await db
      .select()
      .from(accounts)
      .where(eq(accounts.accountId, accountId));
    return result[0] ?? null;
  },

  async findByIdForUser(accountId, userId) {
    const result = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.accountId, accountId),
          userId ? eq(accounts.userId, userId) : undefined
        )
      );

    return result[0] ?? null;
  },

  async listByUser(userId, { page = 1, pageSize = 50 } = {}) {
    const offset = (page - 1) * pageSize;

    return db
      .select()
      .from(accounts)
      .where(userId ? eq(accounts.userId, userId) : undefined)
      .limit(pageSize)
      .offset(offset);
  },

  async adjustBalance(accountId, delta, tx = db) {
    const result = await tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} + ${delta}` })
      .where(eq(accounts.accountId, accountId))
      .returning();
    return result[0] ?? null;
  },

  async generateAccountNumber() {
    const actualDate = new Date();
    const year = actualDate.getFullYear().toString().padStart(4, "0");
    const month = (actualDate.getMonth() + 1).toString().padStart(2, "0");

    const updated = await db
      .update(accountCounters)
      .set({ value: sql`${accountCounters.value} + 1` })
      .where(eq(accountCounters.counterId, "account_number"))
      .returning();

    const counter = updated[0]?.value ?? 1;
    const paddedCounter = counter.toString().padStart(3, "0");

    return { accountNumber: `${year}${month}${paddedCounter}/0100` };
  },
};
