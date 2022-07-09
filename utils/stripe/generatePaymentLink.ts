import {stripe} from './setup';

export const createPaymentLink = async (userId: string, draftId: string) => {
  return await stripe.paymentLinks.create({
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID as string,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      draftId,
    },
    automatic_tax: {
      enabled: true,
    },
  });
};
