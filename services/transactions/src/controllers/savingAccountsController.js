// src/controllers/savingAccountsController.js

import {
    applyInterest as applyInterestService,
    closeSavingAccountById,
    createSavingAccount,
    getALLBalance,
    getALLHistory,
    getAllSavingAccounts,
    getInterestSettings as getInterestSettingsService,
    getSavingAccountById,
    transferALLToCurrent,
    updateInterestRate as updateInterestRateService,
    updateSavingAccountById
} from "../services/savingAccounts.js";

import {validate} from "../services/validationService.js";
import {
    applyInterestSchema,
    closeSavingAccountSchema,
    createSavingAccountSchema,
    getBalanceQuerySchema,
    getHistoryQuerySchema,
    getInterestSettingsSchema,
    transferToCurrentSchema,
    updateInterestRateSchema,
    updateSavingAccountSchema
} from "../validationSchemas/savingAccountsSchemas.js";


class SavingAccountsController {

    async listAccounts(req, res, next) {
        try {
            const data = getAllSavingAccounts();
            res.json(data);
        } catch (e) { next(e); }
    }

    async getAccountById(req, res, next) {
        try {
            const { id } = req.params;
            const account = getSavingAccountById(id);

            if (!account) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json(account);
        } catch (e) { next(e); }
    }

    async getBalance(req, res, next) {
        try {
            const {accountid} =validate(getBalanceQuerySchema, req.query);
            const result = getALLBalance(accountid);

            if (!result) {
                return res.status(404).json({ message: "Saving balance not found" });

            }
            res.json(result);
        } catch (e) { next(e); }
    }

    async getHistory(req, res, next) {
        try {
            const { accountid } = validate(getHistoryQuerySchema, req.query);
            const history = getALLHistory(accountid);

            if (history === null) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json(history);
        } catch (e) { next(e); }
    }
    async getInterestSettings(req, res, next) {
        try {
            const { id } = validate(getInterestSettingsSchema, req.query);

            const settings = getInterestSettingsService(id);

            if (!settings) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json(settings);
        } catch (e) { next(e); }
    }





    async createAccount(req, res, next) {
        try {
            const body = validate(createSavingAccountSchema, req.body);
            const created = createSavingAccount(body);
            res.status(201).json(created);
        } catch (e) { next(e); }
    }

    async transferToCurrent(req, res, next){
        try {
            const body = validate(transferToCurrentSchema, req.body);
            const result = transferALLToCurrent(
                body.savingAccountId,
                body.currentAccountId,
                body.amount
            );
            if (result === null) {
                return res.status(404).json({ message: "Account not found"})
            }

            if (result === "INSUFFICIENT_FUNDS") {
                return res.status(400).json({ message: "INSUFFICIENT_FUNDS" });

            }

            res.json({
                message: "Transfer completed",
                from: result.from,
                to: result.to
            })
        } catch (e) { next(e); }
    }

    async updateAccount(req, res, next) {
        try {
            const body = validate(updateSavingAccountSchema, req.body);
            const updated = updateSavingAccountById(body.id, body);

            if (!updated) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json(updated);
        } catch (e) { next(e); }
    }
    async updateInterestRate(req, res, next) {
        try {
            const body = validate(updateInterestRateSchema, req.body);

            const updated = updateInterestRateService(body.id, body.interestRate);

            if (!updated) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json({
                message: "Interest rate updated",
                account: updated
            });
        } catch (e) { next(e); }
    }

    async closeAccount(req, res, next) {
        try {
            const body = validate(closeSavingAccountSchema, req.body);
            const closed = closeSavingAccountById(body.id);

            if (!closed) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json({ message: "Account closed", account: closed });
        } catch (e) { next(e); }
    }
    async applyInterest(req, res, next) {
        try {
            const { institutionId, accountId, asOf, mode } =
                validate(applyInterestSchema, req.body);

            const result = applyInterestService(institutionId, accountId, asOf, mode);

            if (!result) {
                return res.status(404).json({ message: "Saving account not found" });
            }

            res.json(result);
        } catch (e) { next(e); }
    }

}

const controller = new SavingAccountsController();

export const listAccounts = controller.listAccounts.bind(controller);
export const getAccountById = controller.getAccountById.bind(controller);
export const createAccount = controller.createAccount.bind(controller);
export const updateAccount = controller.updateAccount.bind(controller);
export const closeAccount = controller.closeAccount.bind(controller);
export const getBalance = controller.getBalance.bind(controller);
export const getHistory = controller.getHistory.bind(controller);
export const transferToCurrent = controller.transferToCurrent.bind(controller);
export const getInterestSettings = controller.getInterestSettings.bind(controller);
export const updateInterestRate = controller.updateInterestRate.bind(controller);
export const applyInterest = controller.applyInterest.bind(controller);