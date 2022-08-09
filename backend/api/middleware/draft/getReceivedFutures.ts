import express from 'express';
import {futureFrontendData} from 'shared/dist/types/future';
import {getreceivedFutures as getreceivedFuturesFromDB}
  from '../../../db/future';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
export const getreceivedFutures =
    async (req: express.Request, res: express.Response, next: Function) => {
      const user = req.user as UserSchema;
      const result = await getreceivedFuturesFromDB(user._id, user.email);
      const futureData = await
      futureFrontendData.safeParseAsync(result);
      if (result.success && futureData.success) {
        const response : APIResponse = {
          error: null,
          data: futureData.data,
        };
        res.status(200).json(response);
      } else {
        const response : APIResponse = {
          error: {
            message: 'Unable to find received futures. Please try again later.',
            code: 500,
          },
          data: null,
        };
        res.json(response).status(500);
      }
    };
