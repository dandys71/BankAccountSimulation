/**
 * Transakce — FG_Entity_DB
 * ID, Z účtu, Na účet, částka, fiktivní datum/čas,
 * VS / SS / KS, komentář (vidí obě strany), poznámka (jen odesílatel)
 */
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  transactionId: text("transaction_id").primaryKey(),
  fromAccountId: text("from_account_id").notNull(), // z účtu (ID nebo číslo v counterparty)
  toAccountId: text("to_account_id"), // na účet (interní ID, pokud známé)
  fromAccountNumber: text("from_account_number"),
  toAccountNumber: text("to_account_number"),
  // accountId = účet, vůči kterému se transakce zobrazuje v historii (pro API list)
  accountId: text("account_id").notNull(),
  counterpartyAccount: text("counterparty_account"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("CZK"),
  direction: text("direction").notNull(), // OUTGOING | INCOMING
  status: text("status").notNull(), // PENDING | COMPLETED | CANCELLED | REFUNDED
  vs: text("vs").default(""), // variabilní symbol
  ss: text("ss").default(""), // specifický symbol
  ks: text("ks").default(""), // konstantní symbol
  comment: text("comment").default(""), // vidí obě strany
  note: text("note").default(""), // jen odesílatel
  relatedTransactionId: text("related_transaction_id"),
  simulatedAt: timestamp("simulated_at"), // fiktivní čas transakce
  createdAt: timestamp("created_at").notNull(),
  postedAt: timestamp("posted_at"),
});
