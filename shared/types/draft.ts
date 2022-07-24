import {z} from 'zod';
import { Content } from '../editor/classes/content';

export const draftTypeSchema =
  z.enum(['letter', 'gallery', 'reminder', 'journal', 'goals']);

export const recipientTypeSchema = z.enum(['myself', 'someone else']);

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const hexSchema = z.string().regex(/^#[0-9A-F]{6}$/i);

export const customizationSchema = z.object({
  backgroundColor: hexSchema,
  font: z.string(),
  fontColor: hexSchema,
  dontShowInDrafts: z.boolean(),
});

const draftSchema = z.object({
  _id: z.string().length(24),
  userId: z.string().length(24),
  recipientType: recipientTypeSchema,
  recipientEmail: z.string().optional(),
  lastEdited: dateSchema,
  nextSendDate: dateSchema,
  intervalInDays: z.number().optional(),
  contentCloudStoragePath: z.string().url(),
  type: draftTypeSchema,
  title: z.string(),
  phoneNumber: z.string(),
  backupEmail: z.string(),
  contactEmail: z.string().optional(),
  resources: z.array(z.string())
}).strict();

export const draftFrontendState = draftSchema.omit({
  contentCloudStoragePath: true,
  lastEdited: true,
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
  }).partial().strip()
}).partial().strip();

export const draftResponseBody = z.object({
  content: z.any(),
  properties: draftSchema.omit({
    contentCloudStoragePath: true,
  }).strip()
});

export const miniDraft = draftSchema.pick({
  title: true,
  userId: true,
  _id: true,
  type: true,
}).strip();

export const userDraftsResponseData = z.object({
  drafts: z.array(miniDraft)
})

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
export type MiniDraft = z.infer<typeof miniDraft>;
export type UserDraftsResponseData = z.infer<typeof userDraftsResponseData>;

