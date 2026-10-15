// src/config/validationSchemas.js

import {z} from "zod";

export const createSavingAccountSchema = z.object({
    userId: z.string(),
    accountNumber: z.string(),
    balance: z.number().min(0),
    interestRate: z.number().min(0),
});

export const updateSavingAccountSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    accountNumber: z.string().optional(),
    balance: z.number().min(0).optional(),
    interestRate: z.number().min(0).optional()
});

export const closeSavingAccountSchema = z.object({
    id: z.string()
});

export const getBalanceQuerySchema = z.object({
    accountid: z.string(),
});

export const getHistoryQuerySchema = z.object({
    accountid: z.string(),
})

export const transferToCurrentSchema= z.object({
    savingAccountId: z.string(),
    currentAccountId: z.string(),
    amount: z.number().positive()
})

export const getInterestSettingsSchema = z.object({
    id: z.string()
});

export const updateInterestRateSchema = z.object({
    id: z.string(),
    interestRate: z.number().positive()
});

export const applyInterestSchema = z.object({
    institutionId: z.string(),
    accountId: z.string(),
    asOf: z.string().date(), // nebo z.string() pokud nechceš validovat formát
    mode: z.enum(["dryRun", "execute"])
});


