import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authError } from '../middlewares/errorhandler';

const router = express.Router();

router.post(
  '/api/items/review',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, rating, description, title } = req.body;
    if (!req.currentUser) return next(authError());
    const review = await prisma.review.create({
      data: {
        userId: req.currentUser.id,
        productId,
        rating,
        description,
        title,
      },
      select: {
        Product: {
          select: {
            title: true,
          },
        },
      },
    });
    return res.status(201).send(review);
  }
);

export { router as addReviewRouter };
