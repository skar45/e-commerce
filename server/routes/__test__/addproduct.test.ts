import { Prisma } from '@prisma/client';
import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

type cartCookie = {
  [key: number]: { amount: number; title: string; price: Prisma.Decimal };
};

it('returns an error if the cart does not exist', async () => {
  const response = await request(app)
    .post('/api/items/add')
    .send({ productId: -1, amount: 2 })
    .expect(400);

  expect(response).toHaveProperty('error');
});

it('creates a cart cookie for the unsigned user when adding items to cart', async () => {
  const response = await request(app)
    .post('/api/items/add')
    .send({ productId: 2, amount: 2 })
    .expect(200);

  const cookie = parseCookie(response.headers['set-cookie'][0], 'cart');
  const cart = JSON.parse(cookie!) as cartCookie;

  expect(cookie).toBeDefined();
  expect(cart?.[2].amount).toEqual(2);
});

it('updates the cart cookie for the unsigned user when adding items to cart', async () => {
  const cartSess: cartCookie = {
    2: { amount: 1, price: new Prisma.Decimal(20.23), title: 'item' },
  };
  const response = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`cart=${JSON.stringify(cartSess)}`])
    .send({ productId: 2, amount: 2 })
    .expect(200);
  const cookie = parseCookie(response.headers['set-cookie'][0], 'cart');

  expect(cookie).toBeDefined();
  expect(JSON.parse(cookie!)?.[2].amount).toEqual(3);
});

it('adds item to the cart for the signed user', async () => {
  const data = { productId: 1, amount: 1 };
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');
  const response = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send(data)
    .expect(200);
  expect(response.body.productId).toEqual(data.productId);
});

it('updates item in the cart for the signed user', async () => {
  const data = { productId: 1, amount: 1 };
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');
  const response = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send(data)
    .expect(200);
  const response2 = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send(data)
    .expect(200);
  expect(response2.body.productId).toEqual(data.productId);
  expect(response2.body.amount).toEqual(response.body.amount + data.amount);
});
