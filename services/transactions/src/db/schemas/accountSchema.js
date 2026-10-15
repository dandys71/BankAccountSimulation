import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
    accountId: text("account_id").primaryKey(),
    userId: text("user_id").notNull(),
    institutionId: text("institution_id").notNull(),
    accountNumber: text("account_number").notNull(),
    name: text("name").notNull(),
    currency: text("currency").notNull(),
    balance: integer("balance").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull(),
    closeDate: text("close_date")
});
