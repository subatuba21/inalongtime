import express from 'express';
import {unknownError} from 'shared/dist/types/apiErrors';
import {UserDraftsResponseData} from 'shared/dist/types/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
import {getUserDrafts as getUserDraftsFromDB} from '../../../db/draft';

export const getUserDrafts =
  async (req: express.Request, res: express.Response, next: Function) => {
    const user = req.user as UserSchema;
    const result = await getUserDraftsFromDB(req.dbManager.getDraftDB(),
        user._id);
    if (result.error) {
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else {
      const draftsData = result.draftData as UserDraftsResponseData;
      const response : APIResponse = {
        data: draftsData,
        error: null,
      };
      res.end(JSON.stringify(response));
    }
  };
