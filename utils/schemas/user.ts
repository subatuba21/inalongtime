import {z} from 'zod';

const noSpacesRegex = /^[\S]+$/;
// As stored in db
const userSchema = z.object({
  _id: z.string().length(12),
  firstname: z.string().min(1).regex(noSpacesRegex),
  lastname: z.string().min(1).regex(noSpacesRegex),
  email: z.string().email(),
  passwordHash: z.string().optional(),
});

export const registerUserInputSchema = userSchema.omit({
  _id: true,
  passwordHash: true,
}).extend({
  password: z.string().min(8).regex(noSpacesRegex),
});

export const APILoginInput = z.object({
  data: z.object({
    email: z.string(),
    password: z.string(),
  }),
}).strict();

export const APIRegisterInput = z.object({
  data: registerUserInputSchema,
}).strict();

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type PassportLoginInput = {
  email: string;
  password: string;
}
export type UserInput = Omit<UserSchema, '_id'>
export type ClientUserData = Omit<UserSchema, 'passwordHash'>;
