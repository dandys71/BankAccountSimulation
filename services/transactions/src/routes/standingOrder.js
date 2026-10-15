import {Router} from "express";
import * as StandingController from "../controllers/standingOrderController.js";

export const router = Router();



// POST /v1/standingOrders/createStandingOrder
router.post("/createStandingOrder", StandingController.createStandingOrder);
router.post("/updateStandingOrder", StandingController.updateStandingOrder)
router.post("/deleteStandingOrder", StandingController.deleteStandingOrder)
router.get("/getStandingOrderById", StandingController.getStandingOrderById);
router.get("/listStandingOrders", StandingController.listStandingOrders);
router.post("/runNow", StandingController.runNow);
router.post("/previewNextExecutions", StandingController.previewNextExecutions);