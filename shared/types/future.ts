import { z } from "zod";
import { dateSchema, DraftSchema, draftSchema } from "./draft";
import validator from 'validator';
import {ObjectId} from 'mongodb';

export const mongoDbSchema = z.preprocess((arg) => {
    if (arg instanceof ObjectId)  {
        return arg.toString();
    }
}, z.string().length(24).transform((id) => new ObjectId(id)));

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
    nextSendDate: dateSchema,
    viewed: z.boolean(),
    createdAt: dateSchema,
});

export const futureFrontendData = futureSchema.pick({
    title: true,
    createdAt: true,
});

export const futureResponseBody = z.object({
    content: z.any(),
    properties: futureFrontendData.strip()
});

export const preprocessDraft = z.preprocess((arg) => {
    if (arg) {
        const draft = arg as any;
        draft.viewed = false;
        draft.createdAt = new Date();
        return draft;
    }
}, futureSchema);

export type Future = z.infer<typeof futureSchema>;