import { z } from "zod";
import { dateSchema, DraftSchema, draftSchema } from "./draft";
import validator from 'validator';

export const mongoDbSchema = z.preprocess((arg: any) => {
    if (typeof arg === 'object' && typeof arg.toString === 'function') {
        return (arg as any).toString();
    }
    return arg;
},z.string().refine((arg: string) => {
    return validator.isMongoId(arg);
}));

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
    filesAccessible: z.boolean().default(true),
    createdAt: dateSchema,
}).strip();

export const futureFrontendData = z.object({
    futures: z.array(futureSchema.pick({
        title: true,
        createdAt: true,
        nextSendDate: true,
        recipientEmail: true,
        recipientType: true,
        type: true,
        viewed: true,
        _id: true,
    }).strip())
});

export type FutureFrontendData = z.infer<typeof futureFrontendData>;

export const futureResponseBody = z.object({
    content: z.any(),
    properties: futureSchema.pick({
        title: true,
        createdAt: true,
        nextSendDate: true,
        type: true,
        _id: true,
        customization: true
    }).strip()
});

export const preprocessDraft = z.preprocess((arg) => {
    if (arg) {
        const draft = arg as any;
        draft.viewed = false;
        draft.filesAccesible = true;
        draft.createdAt = new Date();
        return draft;
    }
}, futureSchema);

export type Future = z.infer<typeof futureSchema>;
export type FutureResponseBody = z.infer<typeof futureResponseBody>;