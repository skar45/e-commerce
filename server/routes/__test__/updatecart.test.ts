import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

it('updates the cart for the unsigned user', async () => {
  const addItem = await request(app)
    .post('/api/items/add')
    .send({
      productId: 2,
      amount: 1,
    })
    .expect(200);
  const cookie = parseCookie(addItem.headers['set-cookie'][0], 'cart');

  const updateCart = await request(app)
    .put('/api/items/modify')
    .set('Cookie', [`cart=${cookie}`])
    .send({ productId: 2, amount: 2 })
    .expect(200);

  const updatedCart = parseCookie(updateCart.headers['set-cookie'][0], 'cart');

  expect(JSON.parse(updatedCart!)[2].amount).toEqual(2);
});

it('updates the cart for the signed user', async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');

  const add = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send({ productId: 4, amount: 4 })
    .expect(200);

  const cart = await request(app)
    .put('/api/items/modify')
    .set('Cookie', [`id=${cookie}`])
    .send({ productId: 4, amount: 2 })
    .expect(200);

  expect(cart.body.amount).toEqual(2);
});

it('returns an error if the specified item in the cart is not found', async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');

  const cart = await request(app)
    .put('/api/items/modify')
    .set('Cookie', [`id=${cookie}`])
    .send({ productId: 4, amount: 2 })
    .expect(400);

  expect(cart.body).toHaveProperty('error');
});
