import express, { Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import parseCookie from '../lib/parse-cookie';

const router = express.Router();

type cartCookie = {
  [key: number]: { amount: number; price: Prisma.Decimal; title: string };
};

router.get(
  '/api/user/currentuser',
  authenticate,
  async (req: Request, res: Response) => {
    const userId = req.currentUser?.id;
    const cookie = parseCookie(req.headers.cookie, 'cart');
    if (!userId && !cookie) {
      return res.status(200).json(null);
    }
    if (!userId && cookie) {
      const ListItem = JSON.parse(cookie) as cartCookie;
      return res.status(200).json({ ListItem });
    }

    const productParams = {
      include: {
        Product: {
          select: {
            price: true,
            img: true,
            title: true,
          },
        },
      },
    };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Review: {
          include: {
            Product: {
              select: {
                title: true,
              },
            },
          },
        },
        WishList: productParams,
        Purchased: true,
        ListItem: productParams,
      },
    });

    return user === null
      ? res.status(200).json(null)
      : res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          ListItem: user.ListItem,
          WishList: user.WishList,
          Review: user.Review,
          Purchased: user.Purchased,
        });
  }
);

export { router as currentUser };
