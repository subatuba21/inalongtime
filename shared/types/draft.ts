import {z} from 'zod';
import { Content } from '../editor/classes/content';

export const draftTypeSchema =
  z.enum(['gallery', 'reminder', 'letter', 'journal', 'goals']);

export const recipientTypeSchema = z.enum(['myself', 'someone else']);

const draftSchema = z.object({
  _id: z.string().length(12),
  userId: z.string().length(12),
  recipientType: recipientTypeSchema,
  sendDate: z.date().optional(),
  contentUrl: z.string().url(),
  type: draftTypeSchema,
  title: z.string().min(1),
  confirmed: z.boolean(),
  payment: z.object({
    required: z.boolean(),
    completed: z.boolean(),
  }).optional(),
  backupEmail1: z.string().optional(),
  backupEmail2: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const draftFrontendState = draftSchema.omit({
  contentUrl: true,
}).extend({
  content: z.instanceof(Content).optional()
})

export type DraftSchema = z.infer<typeof draftSchema>;
export type DraftType = z.infer<typeof draftTypeSchema>;
export type DraftFrontendState = z.infer<typeof draftFrontendState>

