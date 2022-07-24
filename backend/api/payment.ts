import {Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {PaymentData} from '../utils/schemas/payment';
import {createPaymentLink} from '../utils/stripe/generatePaymentLink';
import {stripe} from '../utils/stripe/setup';
import {APIResponse} from '../utils/types/apiStructure';
import {mustBeLoggedIn} from './middleware/login';
import {checkDraftValidity, extractPaymentData} from './middleware/payment';

// eslint-disable-next-line new-cap
export const paymentRouter = Router();

paymentRouter.post('/paymentlink', mustBeLoggedIn,
    extractPaymentData, checkDraftValidity, async (req, res) => {
      try {
        const data = req.data as PaymentData;
        const paymentLink = await createPaymentLink(data.userId, data.draftId);
        const response : APIResponse = {
          data: {
            paymentLink: paymentLink.url,
          },
          error: null,
        };
        res.end(JSON.stringify(response));
      } catch {
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

paymentRouter.post('/success', async (req, res) => {
  try {
    const endpointSecret = process.env.STRIPE_ENDPOINT_EVENT as string;
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === 'checkout.session.completed') {

      // more fulfillment functions
    }

    res.end();
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
