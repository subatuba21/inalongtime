import { Content, ContentType } from "./content";
import {z} from 'zod';
import { allowedFileTypesSchema } from "../../types/fileTypes";

export const mediaResourceArraySchema = z.array(z.object({
    caption: z.string(),
    mediaResourceID: z.string(),
    mimetype: allowedFileTypesSchema
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
        if (this.initialized===false) {
            throw new Error('GalleryContent has not been initialized.');
        }
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

    getResourceIDs(): string[] {
        if (this.initialized===false) {
            throw new Error('GalleryContent has not been initialized.');
        }
        const mediaArr = this.mediaResourceArray as MediaResourceArray;
        return mediaArr.map((val) => val.mediaResourceID);
    }
}