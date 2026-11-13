/**
 * Šablona — FG_Entity_DB
 * ID, ID instituce, název šablony, PlatbaID
 */
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const templates = pgTable("templates", {
  templateId: text("template_id").primaryKey(),
  institutionId: text("institution_id").notNull(),
  name: text("name").notNull(),
  paymentId: text("payment_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
});
