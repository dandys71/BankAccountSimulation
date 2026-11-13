/**
 * Počítadlo pro generování jedinečného čísla účtu.
 */
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const accountCounters = pgTable("account_counters", {
  counterId: text("counter_id").primaryKey(),
  value: integer("value").notNull().default(0),
});
