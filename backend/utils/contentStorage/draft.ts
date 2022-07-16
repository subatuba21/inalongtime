/* eslint-disable max-len */
import {DownloadResponse, Storage} from '@google-cloud/storage';
import {DraftType} from 'shared/dist/types/draft';
import {Content} from 'shared/editor/classes/content';
import {parseContent} from 'shared/dist/editor/parseContent';
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

export const getDraftContent =
    async (userId: string, draftId: string, type : DraftType) : Promise<Content> => {
      const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
      const file = bucket.file(getContentFilename(userId, draftId));
      if (await file.exists()) {
        const contentJson = parseDownload(await file.download());
        return parseContent(contentJson, type);
      } else {
        return new Content();
      }
    };

const parseDownload = (file: DownloadResponse) => {
  return JSON.parse(file[0].toString('utf8'));
};
