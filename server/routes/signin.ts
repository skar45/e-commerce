import express, { Request, Response } from 'express';
import { Password } from '../lib/encryption';
import { createJWT } from '../lib/jwt-encrypt';
import { loginCookie } from '../lib/manage-cookie';
import parseCookie from '../lib/parse-cookie';
import prisma from '../lib/prisma';
import { notfoundError, requestError } from '../middlewares/errorhandler';

const router = express.Router();

type cartCookie = { [key: number]: { amount: number } };

router.post('/api/user/signin', async (req: Request, res: Response, next) => {
  const { username, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      ListItem: true,
    },
  });

  if (!findUser) return next(requestError('Incorrect Credentials'));

  const valid = await Password.compare(findUser.password, password);
  if (!valid) return next(requestError('Incorrect Credentials'));

  const parsedCookie = parseCookie(req.headers.cookie, 'cart');
  const userJwt = createJWT(findUser.id, findUser.username);
  res.cookie('id', userJwt, { httpOnly: true, secure: true });
  if (parsedCookie) {
    const updateUser = await loginCookie(
      JSON.parse(parsedCookie) as cartCookie,
      findUser.id,
      findUser.ListItem
    );
    res.clearCookie('cart');
    res
      .status(200)
      .json({
        id: updateUser.id,
        email: updateUser.email,
        ListItem: updateUser.ListItem,
        username: updateUser.username,
      });
    return;
  }

  res
    .status(200)
    .json({
      id: findUser.id,
      email: findUser.email,
      ListItem: findUser.ListItem,
      username: findUser.username,
    });
});

export { router as signinRouter };
