import {z} from 'zod';

const draftSchema = z.object({
  _id: z.string().length(12),
  userId: z.string().length(12),
  sendDate: z.date().optional(),
  contentUrl: z.string().url(),
  type: z.enum(['memory', 'reminder', 'letter', 'journal', 'goals']),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
});

export type DraftSchema = z.infer<typeof draftSchema>;
