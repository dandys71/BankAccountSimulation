import {Router} from "express";
import * as transactionsController from "../controllers/transactionsController.js";

const router = Router();

router.post("/createTransaction", transactionsController.createTransaction);

router.post("/createInternalTransfer", transactionsController.createInternalTransfer);

router.get("/getTransactionById", transactionsController.getTransactionById);

router.get("/listTransactions", transactionsController.listTransactions);

router.post("/refundTransaction", transactionsController.refundTransaction);

router.post("/generateStatement", transactionsController.generateStatement);

router.get("/getPending", transactionsController.getPending);

router.post("/cancelPending", transactionsController.cancelPending);

export { router };