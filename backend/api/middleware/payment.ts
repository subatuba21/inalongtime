import express from 'express';
import {getDraft} from '../../db/draft';
import {PaymentData, paymentDataSchema} from '../../utils/schemas/payment';
import {APIResponse} from '../../utils/types/apiStructure';
import {unknownError} from 'shared/dist/types/apiErrors';
export const extractPaymentData =
    async (req: express.Request, res: express.Response, next: Function) => {
      try {
        const paymentData : PaymentData =
            await paymentDataSchema.parseAsync(req.body);
        req.data = paymentData;
        next();
      } catch {
        const response : APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };

export const checkDraftValidity =
    async (req: express.Request, res: express.Response, next: Function) => {
      const data = req.data as PaymentData;
      const draftResponse = await getDraft(data.draftId);
      if (draftResponse.draft?._id===data.userId &&
        draftResponse.draft?._id === req.user?._id) next();
      else {
        const response: APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };
