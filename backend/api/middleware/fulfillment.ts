import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {deleteDraft} from '../../db/draft';
import {APIResponse} from '../../utils/types/apiStructure';
import {preprocessDraft} from 'shared/dist/types/future';
import {ZodError} from 'zod';
import {addFuture} from '../../db/future';
import {DraftSchema} from 'shared/dist/types/draft';
import {deleteUnnecessaryFiles as deleteUnnecessaryFilesFunc, getDraftContent}
  from '../../utils/contentStorage/draft';
import {isDraftPaid} from '../../utils/draftPaid';
import {deleteDraftIdFromUser} from '../../db/auth';

export const deleteUnnecessaryFiles =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draft = req.draft?.dbObject as DraftSchema;
    await deleteUnnecessaryFilesFunc(req.storage, req.dbManager.getDraftDB(),
        draft.userId, draft);
    next();
  };

export const setIsDraftIsPaid =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draft = req.draft?.dbObject as DraftSchema;
      const content =
        await getDraftContent(req.storage, draft.userId, draft._id, draft.type);
      if (!req.draft) req.draft = {};
      req.draft.paidInfo = isDraftPaid(draft, content);
      next();
    };

export const onlyAllowUnpaid =
  async (req: express.Request, res: express.Response, next: Function) => {
    const paidInfo = req.draft?.paidInfo;
    if (paidInfo?.paid === true) {
      const response : APIResponse = {
        data: null,
        error: {
          code: StatusCodes.FORBIDDEN,
          message:
          // eslint-disable-next-line max-len
          'This draft does not meet the free tier limits and needs to be paid for.',
        },
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    }
    next();
  };

export const convertDraftToFuture =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draft = req.draft?.dbObject as DraftSchema;

      try {
        const future = preprocessDraft.parse(draft);
        const result = await addFuture(req.dbManager.getFutureDB(), future);
        if (result.success) {
          const result = await deleteDraft(
              req.dbManager.getDraftDB(), draft._id);
          await deleteDraftIdFromUser(
              req.dbManager.getDraftDB(), draft.userId, draft._id);
          if (!result.success) {
            return;
          }

          const apiResponse: APIResponse = {
            data: null,
            error: null,
          };

          res.status(StatusCodes.OK).json(apiResponse);
        }
      } catch (err) {
        let message = 'Unable to send draft to future.';
        if (err instanceof ZodError) {
          message = 'Please complete draft before sending to future.';
        }

        const response : APIResponse = {
          data: null,
          error: {
            code: StatusCodes.BAD_REQUEST,
            message,
          },
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };


