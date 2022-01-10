import { NextFunction, Request, Response } from 'express';

class CustomError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    return { error: this.message };
  }
}

export const notfoundError = () => new CustomError(404, 'Route not found');
export const requestError = (message: string) => new CustomError(400, message);
export const dbError = () => new CustomError(500, 'Error connecting to db');
export const authError = () => new CustomError(401, 'Not Authorized');

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json(err.serializeErrors());
  }
  return res.status(400).json({ error: 'Something went wrong' });
};
