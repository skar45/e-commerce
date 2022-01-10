import express, { Request, Response, NextFunction } from 'express';
import { validation } from '../middlewares/signup';
import prisma from '../lib/prisma';
import { Password } from '../lib/encryption';
import { createJWT } from '../lib/jwt-encrypt';
import { requestError } from '../middlewares/errorhandler';
import { loginCookie } from '../lib/manage-cookie';
import parseCookie from '../lib/parse-cookie';

const router = express.Router();

type cartCookie = { [key: number]: { amount: number } };

router.post(
  '/api/user/signup',
  validation,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    if (existingUser?.email === email)
      return next(requestError('Email is taken'));
    if (existingUser?.username === username)
      return next(requestError('Username is taken'));

    const encrypt = await Password.toHash(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: encrypt,
      },
      include: {
        ListItem: true,
      },
    });

    const parsedCookie = parseCookie(req.headers.cookie, 'cart');
    const userJwt = createJWT(newUser.id, newUser.username);
    res.cookie('id', userJwt, { httpOnly: true, secure: true });
    if (parsedCookie) {
      const updateUser = await loginCookie(
        JSON.parse(parsedCookie) as cartCookie,
        newUser.id,
        newUser.ListItem
      );
      res.clearCookie('cart');
      res.status(200).json({
        id: updateUser.id,
        email: updateUser.email,
        ListItem: updateUser.ListItem,
        username: updateUser.username,
      });
      return;
    }

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      ListItem: newUser.ListItem,
      username: newUser.username,
    });
  }
);

export { router as signupRouter };
