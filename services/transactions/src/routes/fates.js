import { Router } from "express";
import * as FatesController from "../controllers/fatesController.js";
import { allowRoles } from "../middlewares/roles.js";

export const router = Router();

router.get("/listFates", FatesController.listFates);
router.get("/getFateById", FatesController.getFateById);
router.post(
  "/createFate",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  FatesController.createFate
);
router.post(
  "/triggerFate",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  FatesController.triggerFate
);
