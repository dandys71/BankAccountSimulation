import {z} from 'zod';

// Validace pro jednorázová platba/převod [POST]
export const createTransactionBodySchema = z.object({
    fromAccountId: z.string().min(1, "Odesílající účet je povinný"),
    toAccountNumber: z.string().min(1, "Číslo účtu příjemce je povinné"),
    amount: z.number().positive("Částka musí být kladné číslo"),
    currency: z.string().length(3).default('CZK'),
    vs: z.string().optional(),
    ks: z.string().optional(),
    ss: z.string().optional(),
    note: z.string().optional()
});


// Validace pro převod mezi vlastními účty [POST]
export const createInternalTransferBodySchema = z.object({
    fromAccountId: z.string().min(1, "Zdrojový účet je povinný"),
    toAccountId: z.string().min(1, "Cílový účet je povinný"),
    amount: z.number().positive("Částka musí být kladné číslo"),
    currency: z.string().length(3).default('CZK'),
    note: z.string().optional()
});


// Validace pro získání detailu transakce [GET]
export const getTransactionByIdSchema = z.object({
    transactionId: z.string().min(1, "ID transakce je povinné")
});


// Validace pro výpis transakcí (filtry v URL) [GET]
export const listTransactionsSchema = z.object({
    accountId: z.string().optional(),
    page: z.string().optional().default("1").transform((val) => Number(val)),
    pageSize: z.string().optional().default("50").transform((val) => Number(val)),
});


// Validace pro vrácení platby (Refund) [POST]
export const refundTransactionSchema = z.object({
    transactionId: z.string().min(1, "ID transakce pro refund je povinné"),
    note: z.string().optional()
});


// Validace pro generování výpisů za období [POST]
export const generateStatementSchema = z.object({
    accountId: z.string().min(1, "ID účtu je povinné"),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formát musí být YYYY-MM-DD"),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formát musí být YYYY-MM-DD"),
    format: z.enum(["PDF", "CSV", "JSON"]).default("PDF")
});


// Validace pro seznam naplánovaných/čekajících plateb [GET]
export const getPendingTransactionsSchema = z.object({
    accountId: z.string().min(1, "ID účtu je povinné pro výpis čekajících plateb")
});


// Validace pro zrušení naplánované/čekající platby [POST]
export const cancelPendingSchema = z.object({
    transactionId: z.string().min(1, "ID transakce je povinné pro zrušení")
});