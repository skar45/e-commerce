import app from '../../app';
import request from 'supertest';
import parseCookie from '../../lib/parse-cookie';
import { Product } from '@prisma/client';

it('successfully purchases item for the user', async () => {
  const products = await request(app).get('/api/items/list').expect(200);

  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');

  const addCart = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send({ productId: products.body[0].id, amount: products.body[0].stock })
    .expect(200);

  const purchase = await request(app)
    .post('/api/items/purchase')
    .set('Cookie', [`id=${cookie}`])
    .send({ cartItems: [addCart.body] })
    .expect(201);

  const updatedProducts = await request(app).get('/api/items/list').expect(200);
  const findProduct = updatedProducts.body.filter(
    (p: Product) => p.id === products.body[0].id
  );

  expect(purchase.body[0].amount).toEqual(addCart.body.amount);
  expect(findProduct[0].stock).toEqual(0);
});
