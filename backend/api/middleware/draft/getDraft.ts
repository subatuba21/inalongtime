import express from 'express';
import {notFoundError, unknownError} from 'shared/dist/types/apiErrors';
import {DraftType, DraftResponseBody,
  draftResponseBody,
  DraftSchema} from 'shared/dist/types/draft';
import {DBError} from '../../../db/errors';
import logger from '../../../logger';
import {getDraftContent} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
import {getDraft as getDraftFromDB} from '../../../db/draft';
import {StatusCodes} from 'http-status-codes';

export const populateDraftFromDB =
    async (req: express.Request, res: express.Response, next: Function) => {
      const id = req.draft?.id as string;
      const draft = await getDraftFromDB(req.dbManager.getDraftDB(), id);
      if (!draft.success) {
        const response : APIResponse = {
          data: null,
          error: notFoundError,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
      }

      if (!req.draft) {
        req.draft = {};
      }

      req.draft.dbObject = draft.draft as DraftSchema;
      next();
    };

export const getDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const result = await getDraftFromDB(req.dbManager.getDraftDB(), draftId);
    const user = req.user as UserSchema;

    if (result.error === DBError.ENTITY_NOT_FOUND) {
      const response : APIResponse = {
        data: null,
        error: notFoundError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else if (result.error) {
      const response : APIResponse = {
        data: null,
        error: notFoundError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    }

    try {
      const draftContent = await getDraftContent(req.storage, user._id,
          draftId, result.draft?.type as DraftType);
      const draftRes : DraftResponseBody = await draftResponseBody.parseAsync({
        content: draftContent.serialize(),
        properties: result.draft,
      });

      const response : APIResponse = {
        data: draftRes,
        error: null,
      };
      res.end(JSON.stringify(response));
    } catch (err) {
      logger.warn(err);
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    }
  };
