import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';
import { Prisma } from '@prisma/client';

type cartCookie = {
  [key: number]: { amount: number; title: string; price: Prisma.Decimal };
};

it('sucessfully signs up a user', async () => {
  const response = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  expect(response.body).toHaveProperty('id');
});

it('successfully signs up the user and updates the cart', async () => {
  const cart: cartCookie = {
    1: { amount: 2, title: 'test', price: new Prisma.Decimal(20.33) },
  };
  const user = await request(app)
    .post('/api/user/signup')
    .set('Cookie', [`cart=${JSON.stringify(cart)}`])
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(200);

  expect(user.body.ListItem).toHaveLength(1);
  expect(parseCookie(user.headers['set-cookie'][0], 'cart')).toBeUndefined();
});

it('fails validaton when signing up a user', async () => {
  const response = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'alfonso',
    })
    .expect(400);

  expect(response.body).toHaveProperty('error');
});

it('returns error when username or email is already taken', async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);

  const emailDupe = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'teasdf34',
      password: 'Alfonso12@',
    })
    .expect(400);

  const userDupe = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'hdasfdds@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(400);

  expect(user.body.username).toEqual('test1234');
  expect(emailDupe.body).toHaveProperty('error');
  expect(userDupe.body).toHaveProperty('error');
});
