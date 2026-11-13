import { Router } from "express";
import * as TimeController from "../controllers/timeController.js";
import { allowRoles } from "../middlewares/roles.js";

export const router = Router();

router.get("/getCurrentSimTime", TimeController.getCurrentSimTime);
router.get("/getSettings", TimeController.getSettings);
router.post(
  "/updateSettings",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  TimeController.updateSettings
);
router.post(
  "/advance",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  TimeController.advance
);
