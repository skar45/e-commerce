import express, { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requestError } from '../middlewares/errorhandler';

const router = express.Router();

router.get(
  '/api/items/category',
  async (req: Request, res: Response, next: NextFunction) => {
    const { tag, category } = req.query;

    if (tag && category) {
      const list = await prisma.product.findMany({
        where: {
          category: {
            hasEvery: category.toString().split(' '),
          },
          tags: {
            hasEvery: tag.toString().split(' '),
          },
        },
      });

      return res.status(200).json(list);
    } else if (category) {
      const list = await prisma.product.findMany({
        where: {
          category: {
            hasEvery: category.toString().split(' '),
          },
        },
      });

      return res.status(200).json(list);
    } else if (tag) {
      const list = await prisma.product.findMany({
        where: {
          tags: {
            hasEvery: tag.toString().split(' '),
          },
        },
      });

      return res.status(200).json(list);
    }

    return next(requestError('Invalid Parameters'));
  }
);

export { router as categoryRouter };
