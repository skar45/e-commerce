import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';
import { Prisma } from '@prisma/client';

type cartCookie = {
  [key: number]: { amount: number; title: string; price: Prisma.Decimal };
};

it("gives an error when the user doesn't provide the correct username", async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/user/signin')
    .send({
      username: 'test123',
      password: 'Alfonso12@',
    })
    .expect(400);

  expect(response.body).toHaveProperty('error');
});

it("gives an error when the user doesn't provide the correct password", async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/user/signin')
    .send({
      username: 'test1234',
      password: 'alfonso12@',
    })
    .expect(400);

  expect(response.body).toHaveProperty('error');
});

it('successfully signs in the user', async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/user/signin')
    .send({
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(200);

  expect(response.body.username).toEqual(user.body.username);
});

it('successfully signs in the user and updates the cart', async () => {
  const cart: cartCookie = {
    1: { amount: 2, title: 'test', price: new Prisma.Decimal(20.45) },
  };
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/user/signin')
    .set('Cookie', [`cart=${JSON.stringify(cart)}`])
    .send({
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(200);

  expect(response.body.ListItem).toHaveLength(1);
  expect(
    parseCookie(response.headers['set-cookie'][0], 'cart')
  ).toBeUndefined();
});
