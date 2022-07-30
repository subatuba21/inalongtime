import { z } from "zod";
import { draftSchema } from "./draft";
import validator from 'validator';
import {ObjectId} from 'mongodb';

export const mongoDbSchema = z.string().length(24).transform((id) => new ObjectId(id))

export const futureSchema = draftSchema.extend({
    recipientEmail: z.string().refine((arg) => {
        if (arg === "") return true;
        else return validator.isEmail(arg);
    }),
    phoneNumber: z.string().refine((ph) => {
        return validator.isMobilePhone(ph, 'any', {
            strictMode: true,
        })
    }, 'Invalid phone number.'),
    title: z.string().min(1),
    backupEmail: z.string().email(),
    _id: mongoDbSchema,
    userId: mongoDbSchema,
});

export type Future = z.infer<typeof futureSchema>;