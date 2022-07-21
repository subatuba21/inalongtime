import { Content, ContentType } from "./content";
import {z} from 'zod';

export const mediaResourceArraySchema = z.array(z.object({
    description: z.string(),
    mediaResourceURL: z.string(),
}));

export type MediaResourceArray = z.infer<typeof mediaResourceArraySchema>;

export const galleryDataSchema = z.object({
    description: z.string(),
    mediaResourceArray: mediaResourceArraySchema
});

export type GalleryData = {
    description: string;
    media: MediaResourceArray
}

export class GalleryContent extends Content {
    type : ContentType = 'gallery';
    description?: string;
    media?: MediaResourceArray = [];


    initialize (args: {
        description: string,
        media: MediaResourceArray
    }) {
        this.description = args.description;
        this.media = args.media;
        this.initialized = true;
    }

    serialize(): object {
        return {
            description: this.description,
            media: this.media,
        }
    }

    deserialize(data: any): void {
        const galleryData = galleryDataSchema.parse(data);
        this.description = galleryData.description;
        this.media = galleryData.mediaResourceArray;
        this.initialized = true;
    }

}