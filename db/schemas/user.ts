import {z} from 'zod';

const userSchema = z.object({
  _id: z.string().length(12),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserSchema = z.infer<typeof userSchema>;
