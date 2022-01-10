import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/user/signout', (req: Request, res: Response) => {
  res.clearCookie('id');
  res.status(200).json(null);
});

export { router as signoutRouter };
