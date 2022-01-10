import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authError } from '../middlewares/errorhandler';

const router = express.Router();

router.delete(
  '/api/items/wishlist',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return next(authError());
    const { wishListId } = req.body;
    const wishList = await prisma.wishList.delete({
      where: { id: wishListId },
    });

    res.status(200).json(wishList);
  }
);

export { router as delWishlistRouter };
