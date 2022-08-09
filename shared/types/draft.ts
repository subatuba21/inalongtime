import {z} from 'zod';
import { Content } from '../editor/classes/content';
import { allowedFileTypesSchema } from './fileTypes';

export const draftTypeSchema =
  z.enum(['letter', 'gallery', 'reminder']);

export const recipientTypeSchema = z.enum(['myself', 'someone else']);

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const hexSchema = z.string().regex(/^#[0-9A-F]{6}$/i);

export const customizationSchema = z.object({
  backgroundColor: hexSchema,
  headerColor: hexSchema.default('#000000'),
  font: z.string(),
  fontColor: hexSchema,
  showDate: z.boolean().default(true).optional(),
});

export const resourceSchema = z.object({
  id: z.string(),
  mimetype: allowedFileTypesSchema,
});

export const draftSchema = z.object({
  _id: z.string().length(24),
  userId: z.string().length(24),
  recipientType: recipientTypeSchema,
  recipientEmail: z.string().optional(),
  lastEdited: dateSchema,
  nextSendDate: dateSchema,
  intervalInDays: z.number().optional(),
  contentCloudStoragePath: z.string(),
  type: draftTypeSchema,
  title: z.string(),
  phoneNumber: z.string(),
  backupEmail: z.string(),
  resources: z.array(resourceSchema),
  customization: customizationSchema.optional(),
  senderName: z.string().optional(),
}).strict();

export const ProgressState = z.enum(['finished', 'unfinished', 'unopened']);

export const draftFrontendState = draftSchema.omit({
  contentCloudStoragePath: true,
  lastEdited: true,
  resources: true,
}).extend({
  content: z.instanceof(Content).optional(),
  progress: z.object({
    'info': ProgressState,
    'content': ProgressState,
    'customize': ProgressState,
    'confirm': ProgressState,
  }).strict(),
});

export const editDraftRequestBody = z.object({
  content: z.any(),
  properties: draftSchema.omit({
    contentCloudStoragePath: true,
    _id: true,
    userId: true,
    payment: true,
    resources: true,
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
export type Resource = z.infer<typeof resourceSchema>;
export type CustomizationSchema = z.infer<typeof customizationSchema>;

