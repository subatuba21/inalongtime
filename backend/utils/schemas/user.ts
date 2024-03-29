import {z} from 'zod';

const noSpacesRegex = /^[\S]+$/;
// As stored in db
const userSchema = z.object({
  _id: z.string().length(12),
  firstname: z.string().min(1).regex(noSpacesRegex),
  lastname: z.string().min(1).regex(noSpacesRegex),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  method: z.enum(['google']).optional(),
  draftIDs: z.array(z.string()).optional(),
  futureIDs: z.array(z.string()).optional(),
});

export const registerUserInputSchema = userSchema.omit({
  _id: true,
  passwordHash: true,
  draftIDs: true,
  futureIDs: true,
  method: true,
}).extend({
  password: z.string().min(8).regex(noSpacesRegex),
  recaptchaToken: z.string(),
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
export type GoogleUserInput = Omit<
  Omit<RegisterUserInput, 'password'>, 'recaptchaToken'>;
export type UserSchema = z.infer<typeof userSchema>;
export type PassportLoginInput = {
  email: string;
  password: string;
}
export type UserInput = Omit<UserSchema, '_id'>
export type ClientUserData = Omit<UserSchema, 'passwordHash'>;
