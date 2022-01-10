import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import prisma from '../lib/prisma';
import { ListItem, Product } from '.prisma/client';
import { authError } from '../middlewares/errorhandler';
import { Prisma } from '@prisma/client';

const router = express.Router();

router.post(
  '/api/items/purchase',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      cartItems,
    }: { cartItems: ListItem[] & { Product: { price: Prisma.Decimal } } } =
      req.body;
    const userId = req.currentUser?.id;
    if (!userId) return next(authError());

    let productsBought: Product[] = [];
    for (const item of cartItems) {
      const updateProducts = await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.amount },
        },
      });
      productsBought.push(updateProducts);
    }

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ListItem: {
          deleteMany: {},
        },
        Purchased: {
          createMany: {
            data: cartItems.map((item) => {
              return {
                productId: item.productId,
                amount: item.amount,
                paid: productsBought.filter((p) => p.id === item.productId)[0]
                  .price,
              };
            }),
          },
        },
      },
      include: {
        Purchased: true,
      },
    });

    res.status(201).json(updateUser.Purchased);
  }
);

export { router as purchaseRouter };
