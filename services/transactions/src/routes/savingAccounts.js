import { Router } from "express";
import * as SavingAccountsController from "../controllers/savingAccountsController.js";

export const router = Router();

router.get("/getAccountById/:id", SavingAccountsController.getAccountById);
router.get("/listAccounts", SavingAccountsController.listAccounts);
router.post("/createAccount", SavingAccountsController.createAccount);
router.post("/updateAccount", SavingAccountsController.updateAccount);
router.post("/closeAccount", SavingAccountsController.closeAccount);
router.get("/getBalance", SavingAccountsController.getBalance);
router.get("/getHistory", SavingAccountsController.getHistory);
router.post("/transferToCurrent", SavingAccountsController.transferToCurrent);
router.post("/transferFromCurrent", SavingAccountsController.transferFromCurrent);
router.get("/getInterestSettings", SavingAccountsController.getInterestSettings);
router.post("/updateInterestRate", SavingAccountsController.updateInterestRate);
router.post("/applyInterest", SavingAccountsController.applyInterest);
