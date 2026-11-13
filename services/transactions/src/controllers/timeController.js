import { SimulationSettings } from "../models/simulationSettings.js";

export async function getCurrentSimTime(req, res, next) {
  try {
    const settings = await SimulationSettings.get();
    res.json({
      currentSimTime: settings?.currentSimTime,
      speedFactor: settings?.speedFactor,
    });
  } catch (e) {
    next(e);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await SimulationSettings.get();
    res.json(settings);
  } catch (e) {
    next(e);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updated = await SimulationSettings.update(req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function advance(req, res, next) {
  try {
    const days = Number(req.body.days || 0);
    const updated = await SimulationSettings.advanceDays(days);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}
