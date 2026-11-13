import { Router } from "express";
import * as TemplatesController from "../controllers/templatesController.js";
import { allowRoles } from "../middlewares/roles.js";

export const router = Router();

router.get("/listTemplates", TemplatesController.listTemplates);
router.get("/getTemplateById", TemplatesController.getTemplateById);
router.post(
  "/createTemplate",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM", "USER"),
  TemplatesController.createTemplate
);
router.post(
  "/updateTemplate",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  TemplatesController.updateTemplate
);
router.post(
  "/deleteTemplate",
  allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"),
  TemplatesController.deleteTemplate
);
