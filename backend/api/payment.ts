import {Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {DraftSchema} from 'shared/dist/types/draft';
import logger from '../logger';
import {createPaymentLink} from '../utils/stripe/generatePaymentLink';
import {APIResponse} from '../utils/types/apiStructure';
import {authorizeDraft} from './middleware/draft/authorizeDraft';
import {populateDraftFromDB} from './middleware/draft/getDraft';
import {extractDraftIDFromURL} from './middleware/extract';
import {mustBeLoggedIn} from './middleware/login';
import {checkDraftValidity, processPayment} from './middleware/payment';
import {convertDraftToFuture,
  deleteUnnecessaryFiles} from './middleware/fulfillment';
import express from 'express';

// eslint-disable-next-line new-cap
export const paymentRouter = Router();

paymentRouter.get('/link/:id',
    mustBeLoggedIn, extractDraftIDFromURL,
    authorizeDraft, populateDraftFromDB,
    checkDraftValidity, async (req, res) => {
      try {
        const draft = req.draft?.dbObject as DraftSchema;
        const paymentLink = await createPaymentLink(draft.userId, draft._id);
        const response : APIResponse = {
          data: {
            paymentLink: paymentLink.url,
          },
          error: null,
        };
        res.end(JSON.stringify(response));
      } catch (err) {
        logger.verbose(err);
        const response : APIResponse = {
          data: null,
          error: {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unable to create payment link.',
          },
        };
        res.end(JSON.stringify(response));
      }
    });

paymentRouter.post('/success', express.raw({type: 'application/json'}),
    processPayment,
    populateDraftFromDB, deleteUnnecessaryFiles, convertDraftToFuture);
