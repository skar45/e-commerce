import express, { Request, Response } from 'express';
import parseCookie from '../lib/parse-cookie';
import prisma from '../lib/prisma';
import { authenticate } from '../middlewares/authenticate';

interface body {
  productId?: number;
  cartId?: number;
}

type cartCookie = { [key: number]: { amount: number } };

const router = express.Router();

router.delete(
  '/api/items/remove',
  authenticate,
  async (req: Request, res: Response) => {
    const { productId, cartId }: body = req.body;

    if (!req.currentUser) {
      const cookie = parseCookie(req.headers.cookie, 'cart');
      if (cookie) {
        const cart = JSON.parse(cookie) as cartCookie;
        if (productId) delete cart[productId];
        res.cookie('cart', JSON.stringify(cart), {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json(cart);
      }

      return res.status(200).json(null);
    }

    const itemDelete = await prisma.listItem.delete({
      where: { id: cartId },
    });

    return res.status(200).json(itemDelete);
  }
);

export { router as delProductRouter };
