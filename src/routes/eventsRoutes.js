import { Router } from 'express';
import * as eventsController from "../controllers/eventsController.js";

export const router = Router();

router.post("/triggerRandomEvent", eventsController.triggerRandomEvent);

router.post("/previewNextWindow", eventsController.previewNextWindow);

router.get("/listEvents", eventsController.listEvents);

router.post("/pauseEvents", eventsController.pauseEvents);

router.post("/resumeEvents", eventsController.resumeEvents);