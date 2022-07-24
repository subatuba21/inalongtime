import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {parseContent} from 'shared/dist/editor/parseContent';
import {unknownError} from 'shared/dist/types/apiErrors';
import {EditDraftRequestBody, DraftType} from 'shared/dist/types/draft';
import {modifyDraft} from '../../../db/draft';
import logger from '../../../logger';
import {postDraftContent} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';

export const editDraft =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draftData = req.draft?.editDraftData as EditDraftRequestBody;
      const draftId = req.draft?.id as string;
      const draftType =
        draftData?.properties?.type || req.draft?.type as DraftType;
      const user = req.user as UserSchema;

      if (draftData.properties) {
        const draftRes = await modifyDraft(draftId, draftData.properties);
        if (draftRes.error) {
          logger.warn(draftRes.error);
          const response : APIResponse = {
            data: null,
            error: unknownError,
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
          return;
        }
      }

      if (draftData.content) {
        try {
          const content = parseContent(draftData.content, draftType);
          await postDraftContent(user._id, draftId, content);
        } catch (err) {
          logger.warn(err);
          const response : APIResponse = {
            data: null,
            error: {
              message: 'Unable to upload draft to storage.',
              code: StatusCodes.INTERNAL_SERVER_ERROR,
            },
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
          return;
        }
      }

      const response : APIResponse = {
        data: null,
        error: null,
      };
      res.end(JSON.stringify(response));
      return;
    };
