import {Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {notFoundError, unknownError} from 'shared/dist/types/apiErrors';
import {futureResponseBody} from 'shared/dist/types/future';
import {getFuture, setFutureViewed} from '../db/future';
import logger from '../logger';
import {getDraftContent} from '../utils/contentStorage/draft';
import {APIResponse} from '../utils/types/apiStructure';
import {extractDraftIDFromURL} from './middleware/extract';

// eslint-disable-next-line new-cap
export const futureRouter = Router();

futureRouter.get('/:id', extractDraftIDFromURL, async (req, res) => {
  const id = req.draft?.id as string;
  const future = await getFuture(id);
  const notFoundRes : APIResponse = {
    data: null,
    error: notFoundError,
  };

  if (!future.success || !future.future) {
    res.status(404).json(notFoundRes);
    return;
  }

  if ((future.future?.nextSendDate as Date) < new Date()) {
    const response : APIResponse = {
      data: null,
      error: notFoundError,
    };

    res.status(404).json(response);
    return;
  }

  if (future.future?.viewed) {
    const user = req.user;
    if (!user || (user.email !== future.future?.recipientEmail &&
      user.email !== future.future?.backupEmail &&
      user._id !== future.future?.userId.toString())) {
      const response : APIResponse = {
        data: null,
        error: {
          code: StatusCodes.FORBIDDEN,
          message:
          `Please log in or create an account to view this page . 
          You must use the account that was sent the 
          email with the link to this page.`,
        },
      };

      res.status(StatusCodes.FORBIDDEN).json(response);
      return;
    }
  }

  try {
    const content = await getDraftContent(future.future.userId.toString(),
        future.future._id.toString(), future.future.type);

    const futureRes = await futureResponseBody.parseAsync({
      content: content.serialize(),
      properties: future.future,
    });

    const response : APIResponse = {
      data: futureRes,
      error: null,
    };
    res.end(JSON.stringify(response));

    if (!future.future?.viewed) {
      await setFutureViewed(id);
    }
  } catch (err) {
    logger.warn(err);
    const response : APIResponse = {
      data: null,
      error: unknownError,
    };
    res.status(response.error?.code as number)
        .end(JSON.stringify(response));
    return;
  }
});
