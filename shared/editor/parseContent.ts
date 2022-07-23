import { DraftType } from "../types/draft";
import { Content } from "./classes/content";
import { GalleryContent } from "./classes/galleryContent";
import { LetterContent } from "./classes/letterContent";

export const parseContent = (content: object, type: DraftType) : Content => {
    switch  (type) {
        case 'letter': {
            const letterContent = new LetterContent();
            letterContent.deserialize(content);
            return letterContent;
        }

        case 'gallery': {
            const galleryContent = new GalleryContent();
            galleryContent.deserialize(content);
            return galleryContent;
        }

        default : {
            return new Content();
        }
    }
}