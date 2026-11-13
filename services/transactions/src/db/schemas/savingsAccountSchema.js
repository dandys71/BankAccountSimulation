/**
 * Spořicí účet — FG_Entity_DB
 * ID, Majitel, jedinečné číslo účtu, úrok [%], zůstatek
 */
import { pgTable, text, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const savingsAccounts = pgTable("savings_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // majitel
  institutionId: text("institution_id").notNull(),
  accountNumber: text("account_number").notNull(),
  name: text("name").notNull().default("Spořicí účet"),
  currency: text("currency").notNull().default("CZK"),
  balance: integer("balance").notNull().default(0),
  interestRate: doublePrecision("interest_rate").notNull().default(0), // %
  isClosed: boolean("is_closed").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  closedAt: timestamp("closed_at"),
  lastInterestAppliedAt: timestamp("last_interest_applied_at"),
});
