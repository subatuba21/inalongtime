import {z} from 'zod';

const futureTypeEnum =
    z.enum(['memory', 'reminder', 'letter', 'journal', 'goals']);

const futureSchema = z.object({
  _id: z.string().length(12),
  userId: z.string().length(12),
  sendDate: z.date(),
  currentDate: z.date(),
  contentUrl: z.string().url(),
  type: futureTypeEnum,
  title: z.string().min(1),
  description: z.string().min(1),
});

export type FutureSchema = z.infer<typeof futureSchema>;
export type FutureType = z.infer<typeof futureTypeEnum>;
