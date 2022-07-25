import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {getDraftReadStream} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
export const getResource =
async (req: express.Request, res: express.Response, next: Function) => {
  const user = req.user as UserSchema;
  const draftId = req.draft?.id as string;
  const resourceId = req.resourceId as string;

  try {
    const headers = {
      'Cache-Control': 'max-age=604800',
    };
    const readStream = await getDraftReadStream(user._id, draftId, resourceId);
    res.status(200).set(headers);
    readStream.pipe(res);
  } catch (err) {
    const response : APIResponse = {
      error: {
        code: StatusCodes.NOT_FOUND,
        message: 'Unable to find resource',
      },
      data: null,
    };
    res.status(response?.error?.code as number).end(JSON.stringify(response));
  }
};
