// src/routes/savingAccounts.js

import {Router} from 'express';
import * as SavingAccountsController from '../controllers/savingAccountsController.js';

//import { allowRoles } from "../middlewares/roles.js";
//import { authMiddleware } from "../middlewares/auth.js";

export const router = Router();

// GET /v1/savingsAccounts/getAccountById/:id
router.get('/getAccountById/:id',/* authMiddleware,*/ SavingAccountsController.getAccountById);

// GET /v1/savingsAccounts/listAccounts
router.get('/listAccounts', /*authMiddleware,*/ SavingAccountsController.listAccounts);

// POST /v1/savingsAccounts/createAccount
router.post('/createAccount', /*allowRoles,("admin", "boss")*/ SavingAccountsController.createAccount);

// POST /v1/savingsAccounts/updateAccount
router.post('/updateAccount', /*authMiddleware,*/ SavingAccountsController.updateAccount);

// POST /v1/savingsAccounts/closeAccount
router.post('/closeAccount',/* authMiddleware,*/ SavingAccountsController.closeAccount);

// GET /v1/savingsAccounts/getBalance
router.get('/getBalance', /*authMiddleware,*/ SavingAccountsController.getBalance);

// GET /v1/savingsAccounts/getHistory
router.get('/getHistory', /*authMiddleware,*/ SavingAccountsController.getHistory);

// POST /v1/savingsAccounts/transferToCurrent
router.post("/transferToCurrent", /*authMiddleware,*/ SavingAccountsController.transferToCurrent);

// GET /v1/savingsAccounts/getInterestSettings
router.get('/getInterestSettings', SavingAccountsController.getInterestSettings);

// POST /v1/savingsAccounts/updateInterestRate
router.post('/updateInterestRate', SavingAccountsController.updateInterestRate);

// POST /v1/savingsAccounts/applyInterest
router.post('/applyInterest', SavingAccountsController.applyInterest);