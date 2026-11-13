/**
 * Osud — FG_Entity_DB
 * ID, Organizace ID, název osudu, popis, PlatbaID
 * (náhodný příjem/výdaj: rozbitá pračka, výhra v loterii, …)
 */
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const fates = pgTable("fates", {
  fateId: text("fate_id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  paymentId: text("payment_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
});
