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

export type GalleryData = z.infer<typeof galleryDataSchema>;

export class GalleryContent extends Content {
    type : ContentType = 'gallery';
    description?: string;
    mediaResourceArray?: MediaResourceArray = [];


    initialize (args: {
        description: string,
        mediaResourceArray: MediaResourceArray
    }) {
        this.description = args.description;
        this.mediaResourceArray = args.mediaResourceArray;
        this.initialized = true;
    }

    serialize(): object {
        const data : GalleryData = {
            description: this.description as string,
            mediaResourceArray: this.mediaResourceArray as MediaResourceArray,
        } 
        return data;
    }

    deserialize(data: any): void {
        const galleryData = galleryDataSchema.parse(data);
        this.description = galleryData.description;
        this.mediaResourceArray = galleryData.mediaResourceArray;
        this.initialized = true;
    }

}