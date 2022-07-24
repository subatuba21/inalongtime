import express from 'express';
import {unauthorizedError} from 'shared/dist/types/apiErrors';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';

export const authorizeDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const user = req.user as UserSchema;

    if (user.draftIDs && user.draftIDs.includes(draftId)) next();
    else {
      const response : APIResponse = {
        data: null,
        error: unauthorizedError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    }
  };
