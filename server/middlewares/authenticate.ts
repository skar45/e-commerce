import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import parseCookie from '../lib/parse-cookie';

interface UserPayload {
  id: number;
  user: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const { cookie } = req.headers;
  const payload = parseCookie(cookie, 'id');
  if (!payload) {
    return next();
  }

  try {
    const user = jwt.verify(payload, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = user;
  } catch (err) {}

  next();
};

export { authenticate };
