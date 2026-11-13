import dotenv from "dotenv";
dotenv.config();

import { db } from "../db/client.js";
import { migrate } from "../db/migrate.js";
import {
  accounts,
  savingsAccounts,
  transactions,
  standingOrders,
  payments,
  templates,
  fates,
  interestRateBands,
  accountCounters,
} from "../db/schemas/index.js";

async function seed() {
  console.log("🌱 Seeding database...");
  await migrate();

  await db.delete(transactions);
  await db.delete(standingOrders);
  await db.delete(templates);
  await db.delete(fates);
  await db.delete(payments);
  await db.delete(interestRateBands);
  await db.delete(savingsAccounts);
  await db.delete(accounts);

  await db
    .insert(accountCounters)
    .values({ counterId: "account_number", value: 3 })
    .onConflictDoUpdate({
      target: accountCounters.counterId,
      set: { value: 3 },
    });

  // Stejná ID jako v services/auth/src/seeds/authSeed.js
  const STUDENT_USER_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const ADMIN_USER_ID = "bbbbbbbbbbbbbbbbbbbbbbbb";
  const INSTITUTION_ID = "dddddddddddddddddddddddd";
  const ORGANIZATION_ID = "cccccccccccccccccccccccc";

  await db.insert(accounts).values([
    {
      accountId: "acc_demo_1",
      userId: STUDENT_USER_ID,
      institutionId: INSTITUTION_ID,
      accountNumber: "202404001/0100",
      name: "Osobní účet",
      currency: "CZK",
      balance: 15000,
      isActive: true,
      createdAt: new Date(),
    },
    {
      accountId: "acc_demo_2",
      userId: STUDENT_USER_ID,
      institutionId: INSTITUTION_ID,
      accountNumber: "202404002/0100",
      name: "Běžný účet 2",
      currency: "CZK",
      balance: 85000,
      isActive: true,
      createdAt: new Date(),
    },
    {
      accountId: "acc_demo_3",
      userId: ADMIN_USER_ID,
      institutionId: INSTITUTION_ID,
      accountNumber: "202404003/0100",
      name: "Účet pro studium",
      currency: "CZK",
      balance: 3200,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  await db.insert(savingsAccounts).values([
    {
      id: "sa_demo_1",
      userId: STUDENT_USER_ID,
      institutionId: INSTITUTION_ID,
      accountNumber: "SA-202404001",
      name: "Spoření",
      currency: "CZK",
      balance: 20000,
      interestRate: 1.8,
      isClosed: false,
      createdAt: new Date(),
    },
  ]);

  await db.insert(interestRateBands).values([
    {
      bandId: "band_1",
      institutionId: INSTITUTION_ID,
      minBalance: 0,
      maxBalance: 19999,
      interestRate: 2.5,
      createdAt: new Date(),
    },
    {
      bandId: "band_2",
      institutionId: INSTITUTION_ID,
      minBalance: 20000,
      maxBalance: 99999,
      interestRate: 1.8,
      createdAt: new Date(),
    },
    {
      bandId: "band_3",
      institutionId: INSTITUTION_ID,
      minBalance: 100000,
      maxBalance: null,
      interestRate: 1.2,
      createdAt: new Date(),
    },
  ]);

  await db.insert(payments).values([
    {
      paymentId: "pay_rent",
      paymentType: "VYDAJ",
      amountType: "PEVNA_CASTKA",
      amount: 1200,
      intervalDays: 30,
      currency: "CZK",
      createdAt: new Date(),
    },
    {
      paymentId: "pay_fate_washer",
      paymentType: "VYDAJ",
      amountType: "NAHODNA",
      minAmount: 500,
      maxAmount: 8000,
      intervalDays: 0,
      currency: "CZK",
      createdAt: new Date(),
    },
  ]);

  await db.insert(templates).values([
    {
      templateId: "tpl_demo_1",
      institutionId: INSTITUTION_ID,
      name: "Nájem",
      paymentId: "pay_rent",
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  await db.insert(fates).values([
    {
      fateId: "evt_demo_1",
      organizationId: ORGANIZATION_ID,
      name: "Rozbitá pračka",
      description: "Rozbila se ti pračka, musíš koupit novou.",
      paymentId: "pay_fate_washer",
      isActive: true,
      createdAt: new Date(),
    },
  ]);
  const now = new Date();
  await db.insert(transactions).values([
    {
      transactionId: "TXN_demo_1",
      fromAccountId: "acc_demo_1",
      toAccountId: null,
      fromAccountNumber: "202404001/0100",
      toAccountNumber: "111222333/0100",
      accountId: "acc_demo_1",
      counterpartyAccount: "111222333/0100",
      amount: 500,
      currency: "CZK",
      direction: "OUTGOING",
      status: "COMPLETED",
      vs: "2024001",
      ss: "",
      ks: "",
      comment: "Demo platba",
      note: "vidí jen odesílatel",
      simulatedAt: now,
      createdAt: now,
      postedAt: now,
    },
  ]);

  await db.insert(standingOrders).values([
    {
      standingOrderId: "so_demo_1",
      fromAccountId: "acc_demo_1",
      toAccountId: null,
      toAccountNumber: "999888777/0100",
      paymentId: "pay_rent",
      templateId: "tpl_demo_1",
      accountId: "acc_demo_1",
      counterpartyAccount: "999888777/0100",
      interval: "monthly",
      dayOfMonth: 15,
      amount: 1200,
      currency: "CZK",
      nextRunAt: new Date("2026-12-15T00:00:00Z"),
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  console.log("✅ Seed hotový (accounts, savings, payments, templates, fates, transactions, standing orders, interest bands)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed selhal", err);
  process.exit(1);
});
