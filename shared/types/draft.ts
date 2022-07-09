import {z} from 'zod';

export const draftTypeSchema =
  z.enum(['gallery', 'reminder', 'letter', 'journal', 'goals']);

const draftSchema = z.object({
  _id: z.string().length(12),
  userId: z.string().length(12),
  sendDate: z.date().optional(),
  contentUrl: z.string().url(),
  type: draftTypeSchema,
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  confirmed: z.boolean(),
  payment: z.object({
    required: z.boolean(),
    completed: z.boolean(),
  }),
});

export type DraftSchema = z.infer<typeof draftSchema>;
export type DraftType = z.infer<typeof draftTypeSchema>;

