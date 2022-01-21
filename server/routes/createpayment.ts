import { Prisma } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';
import { authenticate } from '../middlewares/authenticate';
import { authError } from '../middlewares/errorhandler';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});

const router = express.Router();

router.get(
  '/api/create-payment/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser?.id;
    if (!userId) return next(authError());

    const items = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ListItem: {
          include: {
            Product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    if (!items) return res.status(200).json(null);

    let total: number = 0;
    total = items.ListItem.reduce((x, y) => {
      return x + new Prisma.Decimal(y.Product.price).toNumber() * 100;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'cad',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ stripeSecret: paymentIntent.client_secret });
  }
);

export { router as createPayment };
