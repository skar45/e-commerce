import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { Prisma } from '.prisma/client';
import parseCookie from '../lib/parse-cookie';
import { dbError, requestError } from '../middlewares/errorhandler';
import { title } from 'process';

const router = express.Router();

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

router.post(
  '/api/items/add',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, amount }: body = req.body;

    const productInfo = await prisma.product.findUnique({
      where: { id: productId },
      select: { title: true, price: true, img: true },
    });
    if (!productInfo) return next(requestError('This product does not exist'));

    if (!req.currentUser) {
      const cookie = parseCookie(req.headers.cookie, 'cart');

      if (cookie) {
        const cart = JSON.parse(cookie) as cartCookie;
        if (cart[productId]) {
          cart[productId].amount += amount;
        } else {
          cart[productId] = {
            amount,
            img: productInfo.img,
            price: productInfo.price,
            title: productInfo.title,
          };
        }
        res.cookie('cart', JSON.stringify(cart), {
          httpOnly: true,
          secure: true,
        });
        return res
          .status(200)
          .json({ [productId]: { ...cart[productId], amount } });
      } else {
        const newCart = {
          [productId]: {
            amount,
            img: productInfo.img,
            price: productInfo.price,
            title: productInfo.title,
          },
        };
        res.cookie('cart', JSON.stringify(newCart), {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json(newCart);
      }
    }

    const find = await prisma.listItem.findFirst({
      where: {
        userId: req.currentUser.id,
        productId,
      },
    });

    if (find) {
      const addToCart = await prisma.listItem.update({
        where: { id: find.id },
        data: { amount: amount + find.amount },
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
      return res.status(200).json(addToCart);
    } else {
      const updateCart = await prisma.listItem.create({
        data: {
          userId: req.currentUser.id,
          productId,
          amount,
        },
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
  }
);

export { router as addProductRouter };
