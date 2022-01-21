import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { notfoundError } from '../middlewares/errorhandler';

const router = express.Router();

router.get(
  '/api/items/id/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (typeof parseInt(id) === 'number') {
      const list = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          Review: {
            include: {
              User: {
                select: {
                  username: true,
                },
              },
            },
          },
          WishList: {
            select: {
              id: true,
            },
          },
        },
      });
      if (list) {
        return res
          .status(200)
          .json({ ...list, WishList: list.WishList.length });
      }
    }

    return next(notfoundError());
  }
);

export { router as findProductRouter };
