import { DraftType } from "../types/draft";
import { Content } from "./classes/content";
import { LetterContent } from "./classes/letterContent";

export const parseContent = (content: object, type: DraftType) : Content => {
    switch  (type) {
        case 'letter': {
            const letterContent = new LetterContent();
            letterContent.deserialize(content);
            return letterContent;
        }

        default : {
            return new Content();
        }
    }
}