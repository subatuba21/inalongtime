import {z} from 'zod';
import { Content } from '../editor/classes/content';

export const draftTypeSchema =
  z.enum(['gallery', 'reminder', 'letter', 'journal', 'goals']);

export const recipientTypeSchema = z.enum(['myself', 'someone else']);

const draftSchema = z.object({
  _id: z.string().length(24),
  userId: z.string().length(24),
  recipientType: recipientTypeSchema,
  recipientEmail: z.string(),
  sendDate: z.date(),
  contentCloudStoragePath: z.string().url(),
  type: draftTypeSchema,
  title: z.string(),
  confirmed: z.boolean(),
  payment: z.object({
    required: z.boolean(),
    completed: z.boolean(),
  }).optional(),
  backupEmail1: z.string(),
  backupEmail2: z.string(),
  phoneNumber: z.string(),
}).strict();

export const draftFrontendState = draftSchema.omit({
  contentCloudStoragePath: true,
}).extend({
  content: z.instanceof(Content).optional(),
  progress: z.object({
    'info': z.boolean(),
    'content': z.boolean(),
    'customize': z.boolean(),
    'confirm': z.boolean(),
  }).strict(),
});

export const editDraftRequestBody = z.object({
  content: z.any(),
  properties: draftSchema.omit({
    contentCloudStoragePath: true,
    _id: true,
    userId: true,
    payment: true,
  }).partial().strict()
}).partial().strict();

export const draftResponseBody = z.object({
  content: z.any(),
  properties: draftSchema.omit({
    contentCloudStoragePath: true,
  }).strip()
});

draftSchema.omit({
  contentCloudStoragePath: true,
}).extend({
  content: z.any(),
}).partial();

export type DraftSchema = z.infer<typeof draftSchema>;
export type EditDraftRequestBody = z.infer<typeof editDraftRequestBody>;
export type DraftResponseBody = z.infer<typeof draftResponseBody>;
export type DraftType = z.infer<typeof draftTypeSchema>;
export type DraftFrontendState = z.infer<typeof draftFrontendState>;
export type RecipientType = z.infer<typeof recipientTypeSchema>;
export type StepType = 'info' | 'content' | 'customize' | 'confirm';

