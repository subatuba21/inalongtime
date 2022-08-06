import {Content} from 'shared/dist/editor/classes/content';
import {ReminderContent} from 'shared/dist/editor/classes/reminderContent';
import {LetterContent} from 'shared/dist/editor/classes/letterContent';
import {DraftSchema} from 'shared/dist/types/draft';

export type draftPaidStatus = {
    paid: boolean;
    reason: string;
}

export const isDraftPaid =
    (draft: DraftSchema, content: Content) : draftPaidStatus => {
      const resourceIDs = content.getResourceIDs();
      if (resourceIDs.length > 0) {
        return {
          paid: true,
          reason: 'This draft uses images, video, or audio.',
        };
      }

      if (draft.type === 'letter') {
        const letterContent = content as LetterContent;
        if (letterContent.getWordCount() > 200) {
          return {
            paid: true,
            reason: 'This draft is over 200 words.',
          };
        }
      }

      if (draft.type === 'reminder') {
        const reminderContent = content as ReminderContent;
        if (reminderContent.getWordCount() > 200) {
          return {
            paid: true,
            reason: 'This draft is over 200 words.',
          };
        }
      }


      return {
        paid: false,
        reason: 'This draft is free.',
      };
    };
