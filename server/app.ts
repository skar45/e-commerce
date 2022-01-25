import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { currentUser } from './routes/currentuser';
import { addProductRouter } from './routes/addproduct';
import { addReviewRouter } from './routes/review';
import { addWishlistRouter } from './routes/wishlist';
import { listproductsRouter } from './routes/listproducts';
import { delReviewRouter } from './routes/delreview';
import { delWishlistRouter } from './routes/delwishlist';
import { updateProductRouter } from './routes/updatecart';
import { purchaseRouter } from './routes/purchase';
import { delProductRouter } from './routes/delproduct';
import { errorHandler } from './middlewares/errorhandler';
import { findProductRouter } from './routes/findproduct';
import { createPayment } from './routes/createpayment';
import { stripeHook } from './routes/stripehook';
import { categoryRouter } from './routes/category';

const app = express();

const httpsOptions = {
  cert: readFileSync('./ssl/acme-ecom_xyz.crt'),
  ca: readFileSync('./ssl/acme-ecom_xyz.ca-budle'),
  key: readFileSync('./ssl/main.key'),
};

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.HOST!);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, POST, PUT, DELETE, GET'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
};

// app.use((req: Request, res: Response, next: NextFunction) => {
//   if ((req.protocol = 'http')) {
//     res.redirect(301, `https://${req.headers.host}${req.path}`);
//     return;
//   }
//   next();
// });

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);
app.use(currentUser);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(addProductRouter);
app.use(addReviewRouter);
app.use(addWishlistRouter);
app.use(listproductsRouter);
app.use(updateProductRouter);
app.use(delReviewRouter);
app.use(delWishlistRouter);
app.use(purchaseRouter);
app.use(delProductRouter);
app.use(findProductRouter);
app.use(createPayment);
app.use(stripeHook);
app.use(categoryRouter);

app.use(errorHandler);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

export { httpServer, httpsServer };
