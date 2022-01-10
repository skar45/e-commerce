import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authError } from '../middlewares/errorhandler';

const router = express.Router();

router.post(
  '/api/items/wishlist',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return next(authError());
    const { productId } = req.body;
    const wishList = await prisma.wishList.create({
      data: { userId: req.currentUser.id, productId },
      include: {
        Product: {
          select: {
            title: true,
            price: true,
            img: true,
          },
        },
      },
    });

    res.status(201).send(wishList);
  }
);

export { router as addWishlistRouter };
