import {z} from 'zod';

export const standingOrderID = z.object({
    standingOrderId: z.string(),
});

export const createStandingOrder = z.object({
    accountId: z.string(),
    templateId: z.string().optional(),
    customCron: z.string(),
    dayOfMonth: z.number().optional(),
    amount: z.number(),
    currency: z.string(),
    nextRunAt: z.string(),
    active: z.boolean(),
})

export const updateStandingOrder = z.object({
    standingOrderId: z.string(),

    accountId: z.string(),
    templateId: z.string().optional(),
    customCron: z.string(),
    dayOfMonth: z.number().optional(),
    amount: z.number(),
    currency: z.string(),
    nextRunAt: z.string(),
    active: z.boolean(),
})

export const deleteStandingOrder = z.object( {
    standingOrderId: z.string()
});

export const listStandingOrders = z.object({
    accountId: z.string().optional(),
    userId: z.string().optional(),
    institutionId: z.string().optional(),
    active: z.boolean().optional(),
});

export const runNow = z.object({
    standingOrderId: z.string(),
    asOf: z.string().optional() // Datum, ke kterému se to má provést
});
export const previewNextExecutions = z.object({
    standingOrderId: z.string(),
    windowDays: z.number().min(1).max(365).default(30)
});