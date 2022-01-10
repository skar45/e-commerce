import prisma from '../lib/prisma';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/items/list', async (req: Request, res: Response) => {
  const list = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      stock: true,
      img: true,
      category: true,
      tags: true,
    },
  });
  return res.status(200).json(list);
});

export { router as listproductsRouter };
