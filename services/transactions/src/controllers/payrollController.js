import { SimulationSettings } from "../models/simulationSettings.js";
import { runPayrollOnce } from "../services/cronService.js";

export async function getSettings(req, res, next) {
  try {
    const settings = await SimulationSettings.get();
    res.json({
      payrollAmount: settings?.payrollAmount,
      payrollIntervalMinutes: settings?.payrollIntervalMinutes,
      payrollInterval: settings?.payrollInterval,
      payrollEnabled: settings?.payrollEnabled,
    });
  } catch (e) {
    next(e);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const patch = {};
    if (req.body.payrollAmount !== undefined) {
      patch.payrollAmount = req.body.payrollAmount;
    }
    if (req.body.payrollIntervalMinutes !== undefined) {
      patch.payrollIntervalMinutes = req.body.payrollIntervalMinutes;
    }
    if (req.body.payrollInterval !== undefined) {
      patch.payrollInterval = req.body.payrollInterval;
    }
    if (req.body.payrollEnabled !== undefined) {
      patch.payrollEnabled = req.body.payrollEnabled;
    }
    const updated = await SimulationSettings.update(patch);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function runNow(req, res, next) {
  try {
    const result = await runPayrollOnce();
    res.json(result);
  } catch (e) {
    next(e);
  }
}
