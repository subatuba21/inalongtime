import { Content, ContentType } from "./content";
import {z} from 'zod';

export const goalSchema = z.object({
    name: z.string(),
    reason: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;

export const goalsDataSchema = z.object({
    description: z.string(),
    goals: z.array(goalSchema)
});

export type GoalsDataSchema = z.infer<typeof goalsDataSchema>;

export class GoalsContent extends Content {
    type: ContentType = 'goals';
    description?: string;
    goals?: Goal[];

    serialize() : object {
        if (!this.initialized) throw new Error('GoalsContent has not been initialized.');

        return {
            description: this.description,
            goals: this.goals,
        }
    } 

    deserialize(data: any): void {
        const goalsOb = goalsDataSchema.parse(data);
        this.goals = goalsOb.goals;
        this.description = goalsOb.description;
        this.initialized = true;
    }

    initialize(args: GoalsDataSchema) {
        const goals = goalsDataSchema.parse(args);
        this.description = goals.description;
        this.goals = goals.goals;
        this.initialized = true;
    }
}