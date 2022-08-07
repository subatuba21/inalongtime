import express from 'express';
import {StatusCodes} from 'http-status-codes';
import logger from '../../../logger';
import {getDraftReadStream} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
export const getResource =
async (req: express.Request, res: express.Response, next: Function) => {
  const user = req.user as UserSchema;
  const draftId = req.draft?.id as string;
  const resourceId = req.resourceId as string;

  try {
    const headers : Record<string, string> = {
      'Cache-Control': 'max-age=604800',
    };
    const {stream, contentType} =
      await getDraftReadStream(user._id, draftId, resourceId);
    headers['Content-Type'] = contentType;
    res.status(200).set(headers);
    stream.pipe(res);
  } catch (err) {
    logger.error((err as any).message);
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
