import StripeInitialize from 'stripe';
export const stripe =
    new StripeInitialize(process.env.STRIPE_KEY as string, {
      apiVersion: '2020-08-27',
    });
