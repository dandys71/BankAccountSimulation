import {z} from 'zod';

// Centralizovaná definice validačních schémat (použij pro různé controllery)
export const listAccountsQuerySchema = z.object({
  userId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50)
});

export const accountIdQuerySchema = z.object({
  accountId: z.string()
});





export const getBalanceQuerySchema = accountIdQuerySchema;

export const getHistoryQuerySchema = z.object({
  accountId: z.string(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50)
});

export const getStandingOrdersQuerySchema = accountIdQuerySchema;

export const getQrCodeQuerySchema = z.object({
  accountId: z.string(),
  amount: z.coerce.number(), // asi tady nema byt optional, jelikoz proc by nekdo posilal zadnou castku?
  message: z.string().optional()
});

export const createAccountBodySchema = z.object({
  userId: z.string(),
  institutionId: z.string(),
  currency: z.string(),
  name: z.string().optional()
});

export const updateAccountBodySchema = z.object({
  accountId: z.string(),
  name: z.string().optional(),
  note: z.string().optional(),
  isActive: z.boolean().optional()
});

export const closeAccountBodySchema = z.object({
  accountId: z.string(),
  // closeDate lze posílat jako ISO string (volitelně)
  // TODO LA tady doporučuji použít přímo z.iso.datetime();
  closeDate: z.string().optional()
});