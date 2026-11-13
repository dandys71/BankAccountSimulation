import { Router } from "express";
import * as PayrollController from "../controllers/payrollController.js";
import { allowRoles } from "../middlewares/roles.js";

export const router = Router();

router.get("/getSettings", PayrollController.getSettings);
router.post(
  "/updateSettings",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  PayrollController.updateSettings
);
router.post(
  "/runNow",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  PayrollController.runNow
);
