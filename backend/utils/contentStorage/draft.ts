/* eslint-disable max-len */
import {DownloadResponse, File, Storage} from '@google-cloud/storage';
import {DraftSchema, DraftType} from 'shared/dist/types/draft';
import {Content} from 'shared/dist/editor/classes/content';
import {parseContent} from 'shared/dist/editor/parseContent';
import {Metadata} from '@google-cloud/storage/build/src/nodejs-common';
import fs from 'fs';
import {deleteResourceFromDraft} from '../../db/draft';
import logger from '../../logger';
import {allowedFileTypes} from 'shared/dist/types/fileTypes';
const storage = new Storage({
  keyFilename: `${__dirname}/${process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE_PATH}`,
});

export const getContentFolderName = (userId: string, contentId: string) => {
  return `user-${userId}/content-${contentId}/`;
};

export const getContentFilename = (userId: string, contentId: string) => {
  return `user-${userId}/content-${contentId}/main.json`;
};

export const getContentResourceFileName = (userId: string, contentId: string, resourceId: string) => {
  return `user-${userId}/content-${contentId}/${resourceId}`;
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
      if ((await file.exists())[0]) {
        const contentJson = parseDownload(await file.download());
        try {
          return parseContent(contentJson, type);
        } catch {
          return new Content();
        }
      } else {
        return new Content();
      }
    };

export const deleteDraftContent = async (userId: string, draftId: string) => {
  const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
  const folder = await bucket.getFiles({
    prefix: getContentFolderName(userId, draftId),
  });
  folder[0].forEach(async (file: File) => {
    await file.delete();
  });
};

export const postDraftResource = async (userId: string, draftId: string, resourceId: string, uploadFilePath: string, fileSize: number, contentType: allowedFileTypes) => {
  const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
  let totalStorage = 0;
  const folder = await bucket.getFiles({
    prefix: getContentFolderName(userId, draftId),
  });
  folder[0].forEach(async (file: File) => {
    const metadata : Metadata = (await file.getMetadata());
    totalStorage += metadata.size;
  });

  if (totalStorage + fileSize > 5.05e8) {
    throw new Error('Draft is over 500mb. Please delete resources and try again');
  }
  const path = getContentResourceFileName(userId, draftId, resourceId);
  const file = bucket.file(path);

  const uploadFunc = () : Promise<void> => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(uploadFilePath)
          .pipe(file.createWriteStream({contentType: contentType}))
          .on('finish', () => resolve())
          .on('error', () => reject(new Error('Error writing file to cloud storage')));
    });
  };

  await uploadFunc();
};


export const deleteDraftResource = async (userId: string, draftId: string, resourceId: string) => {
  const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
  const fileName = getContentResourceFileName(userId, draftId, resourceId);
  const file = bucket.file(fileName);
  await file.delete();
};

export const getDraftFile = async (userId: string, draftId: string, resourceId: string) => {
  const bucket = storage.bucket(process.env.CONTENT_BUCKET_NAME as string);
  const fileName = getContentResourceFileName(userId, draftId, resourceId);
  const file = bucket.file(fileName);

  if (await file.exists()) {
    return file;
  } else {
    throw new Error('File does not exist.');
  }
};

export const deleteUnnecessaryFiles = async (userId: string, draftSchema: DraftSchema) => {
  const draftId = draftSchema._id;
  const content = await getDraftContent(userId, draftId, draftSchema.type);
  const contentResources = content.getResourceIDs();
  for (const resource of draftSchema.resources) {
    if (!contentResources.includes(resource.id)) {
      try {
        await deleteDraftResource(userId, draftId, resource.id);
        await deleteResourceFromDraft(draftId, resource.id);
      } catch (e) {
        const err = e as Error;
        logger.warn(err.message);
      }
    }
  }
};


const parseDownload = (file: DownloadResponse) => {
  return JSON.parse(file[0].toString('utf8'));
};
