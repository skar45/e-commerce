import prisma from '../lib/prisma';
import express, { NextFunction, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authError } from '../middlewares/errorhandler';

const router = express.Router();

router.delete(
  '/api/items/review',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.body;
    if (!req.currentUser) return next(authError());
    const review = await prisma.review.delete({
      where: { id: reviewId },
    });
    return res.status(200).json(review);
  }
);

export { router as delReviewRouter };
