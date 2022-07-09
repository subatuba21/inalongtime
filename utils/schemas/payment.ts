import {z} from 'zod';

export const paymentDataSchema = z.object({
  draftId: z.string(),
  userId: z.string(),
}).strict();

export const paymentRequestDataSchema = z.object({
  data: paymentDataSchema,
}).strict();

export type PaymentData = z.infer<typeof paymentDataSchema>;

