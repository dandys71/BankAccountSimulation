/**
 * Fiktivní čas a výplata (mzda) — FG požadavky
 * Obsluha může čas zrychlit; v něm běží výplaty a trvalé příkazy.
 */
import { pgTable, text, integer, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";

export const simulationSettings = pgTable("simulation_settings", {
  settingsId: text("settings_id").primaryKey(),
  institutionId: text("institution_id"),
  currentSimTime: timestamp("current_sim_time").notNull(),
  speedFactor: doublePrecision("speed_factor").notNull().default(1),
  payrollAmount: integer("payroll_amount").notNull().default(0),
  payrollIntervalMinutes: integer("payroll_interval_minutes").notNull().default(30),
  payrollInterval: text("payroll_interval").notNull().default("monthly"),
  payrollEnabled: boolean("payroll_enabled").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull(),
});
