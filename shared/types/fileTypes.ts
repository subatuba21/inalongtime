import {z} from 'zod';

export const allowedFileTypesSchema = z.enum(['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'audio/mp3']);
export type allowedFileTypes = z.infer<typeof allowedFileTypesSchema>;
export const allowedLetterImageFileTypesSchema = z.enum(['image/png', 'image/jpeg']);
export type allowedLetterImageFileTypes = z.infer<typeof allowedLetterImageFileTypesSchema>