import * as schemas from '../validationSchemas/transactionSchema.js';
import * as transactionService from '../services/transactionsService.js';

//[POST]createTransaction
export const createTransaction = async (req, res, next) => {
    try {
        const validation = schemas.createTransactionBodySchema.safeParse(req.body);
        if (!validation.success) return res.status(400).json({ status: "error", errors: validation.error.format() });

        const result = await transactionService.createTransaction(validation.data);
        res.status(201).json(result);
    } catch (error) { next(error); }
};


//[POST]createInternalTransfer
export const createInternalTransfer = async (req, res, next) => {
    try {
        const validation = schemas.createInternalTransferBodySchema.safeParse(req.body);
        if (!validation.success) return res.status(400).json({ status: "error", errors: validation.error.format() });

        if (validation.data.fromAccountId === validation.data.toAccountId) {
            return res.status(400).json({ status: "error", message: "Nelze poslat peníze na stejný účet." });
        }

        const result = await transactionService.createInternalTransfer(validation.data);
        res.status(201).json({ status: "success", data: result });
    } catch (error) { next(error); }
};


//[GET]getTransactionById
export const getTransactionById = async (req, res, next) => {
    try {
        const validation = schemas.getTransactionByIdSchema.safeParse(req.query);
        if (!validation.success) return res.status(400).json({ status: "error", errors: validation.error.format() });

        const result = await transactionService.getTransactionById(validation.data.transactionId);
        res.status(200).json(result);
    } catch (error) { next(error); }
};


//[GET]listTransactions
export const listTransactions = async (req, res, next) => {
    try {
        const validation = schemas.listTransactionsSchema.safeParse(req.query);
        // použijeme defaulty ze schématu, kdyby validace selhala
        const filters = validation.success ? validation.data : { page: 1, pageSize: 50 };

        const result = await transactionService.listTransactions(filters);
        res.status(200).json(result);
    } catch (error) { next(error); }
};


//[POST]refundTransaction
export const refundTransaction = async (req, res, next) => {
    try {
        const validation = schemas.refundTransactionSchema.safeParse(req.body);
        if (!validation.success) return res.status(400).json({ status: "error", errors: validation.error.format() });

        const result = await transactionService.refundTransaction(validation.data.transactionId, validation.data.note);
        res.status(200).json({ status: "success", data: result });
    } catch (error) { next(error); }
};


//[POST]generateStatement
export const generateStatement = async (req, res, next) => {
    try {
        const validation = schemas.generateStatementSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ status: "error", errors: validation.error.format() });
        }

        const result = await transactionService.generateStatement(validation.data);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


//[GET]getPending
export const getPending = async (req, res, next) => {
    try {
        const validation = schemas.getPendingTransactionsSchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({ status: "error", errors: validation.error.format() });
        }

        const result = await transactionService.getPendingTransactions(validation.data.accountId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


//[POST]cancelPending
export const cancelPending = async (req, res, next) => {
    try {
        const validation = schemas.cancelPendingSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ status: "error", errors: validation.error.format() });
        }

        const result = await transactionService.cancelPending(validation.data.transactionId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};