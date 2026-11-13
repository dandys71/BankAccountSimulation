/**
 * Trvalé příkazy — FG_Entity_DB
 * ID, Z účtu, Na účet, PlatbaID, Další platba (timestamp)
 */
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const standingOrders = pgTable("standing_orders", {
  standingOrderId: text("standing_order_id").primaryKey(),
  fromAccountId: text("from_account_id").notNull(), // z účtu
  toAccountId: text("to_account_id"), // na účet (interní ID)
  toAccountNumber: text("to_account_number"), // na účet (číslo)
  paymentId: text("payment_id"), // PlatbaID
  templateId: text("template_id"),
  // API kompatibilita se stávajícími endpointy
  accountId: text("account_id").notNull(),
  counterpartyAccount: text("counterparty_account"),
  interval: text("interval"),
  customCron: text("custom_cron"),
  dayOfMonth: integer("day_of_month"),
  amount: integer("amount"),
  currency: text("currency").default("CZK"),
  nextRunAt: timestamp("next_run_at"), // další platba
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
});
