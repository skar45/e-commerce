import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/api/items/category/:type', async (req: Request, res: Response) => {
  const { type } = req.params;

  const list = await prisma.product.findMany({
    where: {
      category: {
        has: type,
      },
    },
  });

  res.status(200).json(list);
});

export { router as categoryRouter };
