/**
 * „model“ je jen popis tvaru dat, se kterými aplikace pracuje, plus pár funkcí, jak s těmito daty zacházet.
 *
 * Jednoduchý "model" účtu – zatím v paměti, aby šlo rychle začít.
 * Tvar dat odpovídá OpenAPI: Account
 */
import crypto from 'crypto'; //toto se používá jen na generování náhodného ID pro uživatele

import {db } from '../db/client.js'
import { accounts } from '../db/schemas/accountSchema.js'
import { eq, and } from "drizzle-orm";


const _mem = new Map();

// pocitadlo, ktery se pouziva pro generaci unikatniho cisla uctu
let accountCounter = 1;

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const Accounts = {
  async create(data) {
    const accountId = `acc_${crypto.randomUUID()}`;
    const createdAt = new Date();

    //zde se vytvoří pomocná proměnná pro nový účet a nahrají se do ní potřebná data
    const item = {
      accountId,
      userId: data.userId,
      institutionId: data.institutionId,
      accountNumber: data.accountNumber || '000000000/0100',
      name: data.name || 'Můj účet',
      currency: data.currency,
      balance: data.balance ?? 0,
      isActive: true,
      createdAt
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
              closeDate: closeDate || new Date().toISOString().slice(0, 10)
          })
          .where(eq(accounts.accountId, accountId))
          .returning();

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

  generateAccountNumber() {
    const actualDate = new Date();

    // padStart() zajistuje, aby byly nuly
    const year = actualDate.getFullYear().toString().padStart(4, '0');
    const month = (actualDate.getMonth() + 1).toString().padStart(2, '0');
    const paddedCounter = accountCounter.toString().padStart(3, '0');

    accountCounter++;

    return `${year}${month}${paddedCounter}/0100`;
  }
};
