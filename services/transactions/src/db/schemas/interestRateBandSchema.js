/**
 * Úrokové pásmo spořicího účtu — FG požadavky
 * Různé sazby podle výše vkladu (čím větší částka, tím menší sazba).
 */
import { pgTable, text, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const interestRateBands = pgTable("interest_rate_bands", {
  bandId: text("band_id").primaryKey(),
  institutionId: text("institution_id").notNull(),
  minBalance: integer("min_balance").notNull().default(0),
  maxBalance: integer("max_balance"), // null = bez horní hranice
  interestRate: doublePrecision("interest_rate").notNull(), // %
  createdAt: timestamp("created_at").notNull(),
});
