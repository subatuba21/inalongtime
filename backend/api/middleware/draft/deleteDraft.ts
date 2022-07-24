import express from 'express';
import {unknownError} from 'shared/dist/types/apiErrors';
import {deleteDraftIdFromUser} from '../../../db/auth';
import {} from '../../../utils/contentStorage/draft';
import logger from '../../../logger';
import {deleteDraftContent} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
import {deleteDraft as deleteDraftFromDB} from '../../../db/draft';

export const deleteDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const draftRes = await deleteDraftFromDB(draftId);
    const user = req.user as UserSchema;
    await deleteDraftContent(user._id, draftId);
    const error = await deleteDraftIdFromUser(user._id, draftId);

    if (draftRes.error || error) {
      logger.warn(draftRes.error || error);
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else {
      const response : APIResponse = {
        data: null,
        error: null,
      };
      res.end(JSON.stringify(response));
    }
  };
