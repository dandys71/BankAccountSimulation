import { Router } from "express";
import * as AccountsController from "../controllers/accountsController.js";
import { allowRoles } from "../middlewares/roles.js";

export const router = Router();

router.get("/getAccountById", AccountsController.getAccountById);
router.get("/listAccounts", AccountsController.listAccounts);
router.post("/createAccount", allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"), AccountsController.createAccount);
router.post("/updateAccount", AccountsController.updateAccount);
router.post("/closeAccount", AccountsController.closeAccount);
router.get("/getBalance", AccountsController.getBalance);
router.get("/getHistory", AccountsController.getHistory);
router.get("/getStandingOrders", AccountsController.getStandingOrders);
router.post("/generateAccountNumber", allowRoles("admin", "boss", "SYSTEM_ADMIN", "SYSTEM"), AccountsController.generateAccountNumber);
router.get("/getQrCode", AccountsController.getQrCode);
