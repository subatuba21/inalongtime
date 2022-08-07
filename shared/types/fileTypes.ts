import {z} from 'zod';

export const allowedFileTypesSchema = z.enum(['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'audio/mpeg']);
export type allowedFileTypes = z.infer<typeof allowedFileTypesSchema>;
export const allowedLetterImageFileTypesSchema = z.enum(['image/png', 'image/jpeg']);
export type allowedLetterImageFileTypes = z.infer<typeof allowedLetterImageFileTypesSchema>