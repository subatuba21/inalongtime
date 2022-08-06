import { Content, ContentType } from "./content";
import {z} from 'zod';

export const reminderSchema = z.object({
    name: z.string(),
    reason: z.string(),
});

export class ReminderContent extends Content {
    type: ContentType = 'reminder';
    subject?: string;
    text?: string;

    serialize() : object {
        if (!this.initialized) throw new Error('ReminderContent has not been initialized.');

        return {
            text: this.text,
            subject: this.subject,
        }
    } 

    deserialize(data: any): void {
        if (typeof data.subject === 'string' && typeof data.text === 'string') {
            this.subject = data.subject;
            this.text = data.text;
            this.initialized = true;
        } else {
            throw new Error('Incorrect data needed to deserialize ReminderContent');
        }
    }

    initialize(args: {
        subject: string,
        text: string,
    }) {
        this.subject = args.subject;
        this.text = args.text;
        this.initialized = true;
    }

    getWordCount() {
        let count = 0;
        count += this.subject?.split(' ').length ?? 0;
        count += this.text?.split(' ').length ?? 0;
        return count;
      }
    
}