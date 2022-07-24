import express from 'express';
import {UploadedFile} from 'express-fileupload';
import {ObjectId} from 'mongodb';
import {addResourceToDraft} from '../../../db/draft';
import {postDraftResource} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
import fs from 'fs';

export const allowedFileTypes = ['image/png', 'image/jpeg', 'video/mp4'];

export const allowFileTypes =
    async (req: express.Request, res: express.Response, next: Function) => {
      if (!req.files || !req.files.file) {
        const response : APIResponse = {
          data: null,
          error: {
            code: 400,
            message: 'Must provide file to upload.',
          },
        };
        res.status(400).end(JSON.stringify(response));
        return;
      }

      const file = req.files.file as UploadedFile;
      if (allowedFileTypes.includes(file.mimetype)) {
        next();
      } else {
        const response : APIResponse = {
          data: null,
          error: {
            code: 400,
            message:
            'File type is not supported. Please submit a .jpg, .png, or .mp4',
          },
        };
        res.status(400).end(JSON.stringify(response));
        return;
      }
    };

export const uploadResource =
  async (req: express.Request, res: express.Response, next: Function) => {
    const user = req.user as UserSchema;
    const draftId = req.draft?.id as string;

    if (!req.files || !req.files.file) {
      const response : APIResponse = {
        data: null,
        error: {
          code: 400,
          message: 'Must provide file to upload.',
        },
      };
      res.status(400).end(JSON.stringify(response));
      return;
    } else {
      const file = req.files.file as UploadedFile;
      if (file.size > 3.05e8) {
        const response : APIResponse = {
          data: null,
          error: {
            code: 413,
            message: 'File must be 300MB or smaller',
          },
        };
        res.status(413).end(JSON.stringify(response));
        await fs.promises.unlink(file.tempFilePath);
      } else {
        const resourceId = new ObjectId().toString();
        try {
          await postDraftResource(
              user._id, draftId, resourceId, file.tempFilePath, file.size);
        } catch (err) {
          const error = err as Error;
          const response : APIResponse = {
            data: null,
            error: {
              code: 500,
              message: error.message,
            },
          };
          res.status(500).end(JSON.stringify(response));
          await fs.promises.unlink(file.tempFilePath);
          return;
        }

        await addResourceToDraft(draftId, resourceId);

        const response : APIResponse = {
          data: {
            resourceId,
          },
          error: null,
        };
        res.end(JSON.stringify(response));
        await fs.promises.unlink(file.tempFilePath);
      }
    }
  };
