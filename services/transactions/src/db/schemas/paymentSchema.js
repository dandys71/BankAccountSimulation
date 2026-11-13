/**
 * Platba — FG_Entity_DB
 * TypPlatby [PRIJEM|VYDAJ], TypCastky [NAHODNA|PEVNA_CASTKA],
 * Castka / MinCastka / MaxCastka, Interval (dny; 30=měsíc, 365=rok, 91=čtvrtletí)
 */
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  paymentId: text("payment_id").primaryKey(),
  paymentType: text("payment_type").notNull(), // PRIJEM | VYDAJ
  amountType: text("amount_type").notNull(), // NAHODNA | PEVNA_CASTKA
  amount: integer("amount"), // jen u PEVNA_CASTKA
  minAmount: integer("min_amount"), // jen u NAHODNA
  maxAmount: integer("max_amount"), // jen u NAHODNA
  intervalDays: integer("interval_days").notNull().default(30),
  currency: text("currency").notNull().default("CZK"),
  createdAt: timestamp("created_at").notNull(),
});
