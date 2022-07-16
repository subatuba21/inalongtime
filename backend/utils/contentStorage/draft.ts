/* eslint-disable max-len */
import {Storage} from '@google-cloud/storage';
import {Content} from 'shared/editor/classes/content';
const storage = new Storage();

export const getContentFilename = (userId: string, contentId: string) => {
  return `user-${userId}/content-${contentId}/main.json`;
};

export type ContentPath = string;

export const postDraftContent =
    async (userId: string, draftId: string, content : Content) : Promise<ContentPath> => {
      const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
      const path = getContentFilename(userId, draftId);
      const file = bucket.file(path);
      await file.save(JSON.stringify(content.serialize()));
      return path;
    };

// const getDraftContent =
//     async (userId: string, draftId: string, content : Content) => {
//       const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
//       const file = bucket.file(getContentFilename(userId, draftId));
//     };
