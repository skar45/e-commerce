import { Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import parseCookie from '../lib/parse-cookie';
import prisma from '../lib/prisma';
import { authenticate } from '../middlewares/authenticate';
import { requestError } from '../middlewares/errorhandler';

interface body {
  productId: number;
  amount: number;
}

type cartCookie = {
  [key: number]: {
    amount: number;
    price: Prisma.Decimal;
    title: string;
    img: string[];
  };
};

const router = express.Router();

router.put(
  '/api/items/modify',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, amount }: body = req.body;

    if (!req.currentUser) {
      const cookie = parseCookie(req.headers.cookie, 'cart');
      if (cookie) {
        const cart = JSON.parse(cookie) as cartCookie;
        if (cart[productId]) cart[productId].amount = amount;

        res.cookie('cart', JSON.stringify(cart), {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ [productId]: cart[productId] });
      }

      return res.status(200).json(null);
    }

    const findCart = await prisma.listItem.findFirst({
      where: { userId: req.currentUser.id, productId },
    });

    if (!findCart) return next(requestError('cannot find the user cart'));

    const updateCart = await prisma.listItem.update({
      where: { id: findCart.id },
      data: { amount },
      include: {
        Product: {
          select: {
            price: true,
            title: true,
            img: true,
          },
        },
      },
    });

    return res.status(200).json(updateCart);
  }
);

export { router as updateProductRouter };
