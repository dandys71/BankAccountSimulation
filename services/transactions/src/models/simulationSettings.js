import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { simulationSettings } from "../db/schemas/index.js";

const GLOBAL_ID = "global";

export const SimulationSettings = {
  async get(settingsId = GLOBAL_ID) {
    const rows = await db
      .select()
      .from(simulationSettings)
      .where(eq(simulationSettings.settingsId, settingsId));
    return rows[0] ?? null;
  },

  async update(data, settingsId = GLOBAL_ID) {
    const result = await db
      .update(simulationSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(simulationSettings.settingsId, settingsId))
      .returning();
    return result[0] ?? null;
  },

  async advanceDays(days, settingsId = GLOBAL_ID) {
    const current = await this.get(settingsId);
    if (!current) return null;
    const next = new Date(current.currentSimTime);
    next.setDate(next.getDate() + Number(days || 0));
    return this.update({ currentSimTime: next }, settingsId);
  },
};
