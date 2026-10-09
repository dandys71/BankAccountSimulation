import { z } from 'zod';

// Musí tu být EXPORT, aby to ostatní soubory viděly
export const triggerEventSchema = z.object({
    institutionId: z.string().min(1, "institutionId je povinné"),
    accountId: z.string().min(1, "accountId je povinné"),
    seed: z.number().optional().default(0)
});


export const previewNextWindowSchema = z.object({
    institutionId: z.string().min(1, "institutionId je povinné"),
    accountId: z.string().min(1, "accountId je povinné"),
    windowDays: z.number().int().positive().default(30)
});


export const listEventsSchema = z.object({
    accountId: z.string().optional(),
    institutionId: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
});


export const pauseEventsSchema = z.object({}).optional();


export const resumeEventsSchema = z.object({}).optional();