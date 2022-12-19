import {Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {notFoundError, unknownError} from 'shared/dist/types/apiErrors';
import {futureResponseBody} from 'shared/dist/types/future';
import {getUser} from '../db/auth';
import {getFuture, setFilesAccessibleFalse,
  setFutureViewed} from '../db/future';
import logger from '../logger';
import {allowedToAccessFuture} from '../utils/allowedFutureAccess';
import {getDraftContent} from '../utils/contentStorage/draft';
import {sendFutureViewedEmail} from '../utils/email/futureViewedEmail';
import {UserSchema} from '../utils/schemas/user';
import {APIResponse} from '../utils/types/apiStructure';
import {extractDraftIDFromURL} from './middleware/extract';

// eslint-disable-next-line new-cap
export const futureRouter = Router();

futureRouter.get('/:id', extractDraftIDFromURL, async (req, res) => {
  const id = req.draft?.id as string;
  const future = await getFuture(req.dbManager.getFutureDB(), id);
  const notFoundRes : APIResponse = {
    data: null,
    error: notFoundError,
  };

  logger.verbose(future);

  if (!future.success || !future.future) {
    res.status(404).json(notFoundRes);
    return;
  }

  if ((future.future?.nextSendDate as Date) > new Date()) {
    const response : APIResponse = {
      data: null,
      error: notFoundError,
    };

    res.status(404).json(response);
    return;
  }

  if (!allowedToAccessFuture(future.future, {
    user: req.user ? req.user as UserSchema : undefined,
  })) {
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

  try {
    const content = await getDraftContent(future.future.userId.toString(),
        future.future._id.toString(), future.future.type);

    const futureRes = await futureResponseBody.parseAsync({
      content: content.serialize(),
      properties: future.future,
    });

    if (!future.future?.viewed &&
      !(future.future.recipientType === 'someone else' &&
      req.user &&
      req.user._id === future.future.userId)) {
      await setFutureViewed(req.dbManager.getFutureDB(), id);

      setTimeout(async () => {
        await setFilesAccessibleFalse(req.dbManager.getFutureDB(), id);
      }, 1000 * 60 * 10);

      if (future.future.recipientType === 'someone else' ) {
        const user = await getUser(req.dbManager.getUserDB(),
            future.future._id.toString());

        if (user.success) {
          await sendFutureViewedEmail(
            user.user?.email as string, future.future);
        }
      }
    }

    const response : APIResponse = {
      data: futureRes,
      error: null,
    };
    res.end(JSON.stringify(response));
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
