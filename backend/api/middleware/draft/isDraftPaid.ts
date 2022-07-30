import express from 'express';
import {unknownError} from 'shared/dist/types/apiErrors';
import {APIResponse} from '../../../utils/types/apiStructure';
export const returnIsDraftPaid =
    async (req: express.Request, res: express.Response, next: Function) => {
      if (req.draft?.paidInfo !== undefined) {
        const response : APIResponse = {
          data: {paidInfo: req.draft.paidInfo},
          error: null,
        };
        res.json(response);
      } else {
        const response : APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number).json(response);
      }
    };

