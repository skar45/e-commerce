import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { notfoundError, requestError } from '../middlewares/errorhandler';

const endpointSecret = process.env.STRIPE_END_KEY;
const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});
const router = express.Router();

router.post('/webhook', (req: Request, res: Response, next: NextFunction) => {
  let event: Stripe.Event = req.body;
  const signature = req.headers['stripe-signature'];

  if (endpointSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      if (err instanceof Error) {
        return next(requestError(err.message));
      } else {
        return next(notfoundError());
      }
    }
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log(`PaymentIntent for ${paymentMethod} was successful!`);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return res.send({});
});

export { router as stripeHook };
