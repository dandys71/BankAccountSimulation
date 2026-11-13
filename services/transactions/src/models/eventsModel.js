import { SimulationSettings } from "./simulationSettings.js";
import { EventTemplates } from "./eventTemplates.js";

export { EventTemplates };

export async function createSimulationStatusObject(days = 0, months = 0) {
  const current = await SimulationSettings.get();
  const base = current?.currentSimTime ? new Date(current.currentSimTime) : new Date();
  const futureDate = new Date(base);
  futureDate.setMonth(futureDate.getMonth() + Number(months || 0));
  futureDate.setDate(futureDate.getDate() + Number(days || 0));

  await SimulationSettings.update({ currentSimTime: futureDate });

  return {
    currentSimulationTime: futureDate.toISOString(),
    shiftedDays: days,
    shiftedMonths: months,
    status: "RUNNING",
  };
}
