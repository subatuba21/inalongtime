import express from 'express';
import {PaymentData, paymentDataSchema} from '../../utils/schemas/payment';
import {APIResponse} from '../../utils/types/apiStructure';
import {unknownError} from 'shared/dist/types/apiErrors';
import {DraftSchema} from 'shared/dist/types/draft';
import {futureSchema} from 'shared/types/future';
import {StatusCodes} from 'http-status-codes';
import {stripe} from '../../utils/stripe/setup';
import Stripe from 'stripe';
import logger from '../../logger';

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
      const draft = req.draft?.dbObject as DraftSchema;
      const parseRes = await futureSchema.safeParseAsync(draft);
      if (parseRes.success) next();
      else {
        const response : APIResponse = {
          data: null,
          error: {
            code: StatusCodes.BAD_REQUEST,
            message: 'Please complete draft before payment.',
          },
        };
        res.status(response.error?.code as number)
            .json(response);
      }
    };

export const processPayment =
  async (req: express.Request, res: express.Response, next: Function) => {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
      const sig = req.headers['stripe-signature'] as string;
      const event =
        stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session?.metadata?.draftId) {
          const errMessage = 'No draft ID found in session metadata.';
          logger.error(errMessage);
          res.status(400).send(`Webhook Error: ${errMessage}`);
          return;
        }
        req.draft = {};
        req.draft.id = session?.metadata?.draftId;
        next();
      // more fulfillment functions
      }
    } catch (err: any) {
      logger.error(err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };
