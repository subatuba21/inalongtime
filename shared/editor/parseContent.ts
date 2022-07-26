import { DraftType } from "../types/draft";
import { Content } from "./classes/content";
import { GalleryContent } from "./classes/galleryContent";
import { LetterContent } from "./classes/letterContent";
import { ReminderContent } from "./classes/reminderContent";

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

        case 'reminder': {
            const reminderContent = new ReminderContent();
            reminderContent.deserialize(content);
            return reminderContent;
        }

        default : {
            return new Content();
        }
    }
}