import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {deleteDraft} from '../../db/draft';
import {APIResponse} from '../../utils/types/apiStructure';
import {futureSchema} from '../../../shared/types/future';
import {ZodError} from 'zod';
import {addFuture} from '../../db/future';
import {DraftSchema} from 'shared/types/draft';
import {deleteUnnecessaryFiles as deleteUnnecessaryFilesFunc, getDraftContent}
  from '../../utils/contentStorage/draft';
import {isDraftPaid} from '../../utils/draftPaid';

export const deleteUnnecessaryFiles =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draft = req.draft?.dbObject as DraftSchema;
    await deleteUnnecessaryFilesFunc(draft.userId, draft);
    next();
  };

export const setIsDraftIsPaid =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draft = req.draft?.dbObject as DraftSchema;
      const content =
        await getDraftContent(draft.userId, draft._id, draft.type);
      if (!req.draft) req.draft = {};
      req.draft.paid = isDraftPaid(draft, content).paid;
      next();
    };

export const convertDraftToFuture =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draft = req.draft?.dbObject as DraftSchema;

      try {
        const future = futureSchema.parse(draft);
        const result = await addFuture(future);
        if (result.success) {
          const result = await deleteDraft(draft._id);
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
          message = err.message;
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


