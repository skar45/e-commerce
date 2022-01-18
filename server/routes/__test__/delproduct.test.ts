import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

type cartCookie = { [key: number]: { amount: number } };

it('deletes item from the cookie', async () => {
  const cart: cartCookie = { 3: { amount: 3 }, 1: { amount: 1 } };

  const response = await request(app)
    .delete('/api/items/remove')
    .set('Cookie', [`cart=${JSON.stringify(cart)}`])
    .send({ productId: 3 })
    .expect(200);
  const updatedCart = JSON.parse(
    parseCookie(response.headers['set-cookie'][0], 'cart')!
  ) as cartCookie;

  expect(updatedCart[3]).toBeUndefined;
});

it("deletes item from the user's cart", async () => {
  const data = { productId: 2, amount: 3 };
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');
  const addtoCart = await request(app)
    .post('/api/items/add')
    .set('Cookie', [`id=${cookie}`])
    .send(data)
    .expect(200);

  const delCart = await request(app)
    .delete('/api/items/remove')
    .set('Cookie', [`id=${cookie}`])
    .send({ cartId: addtoCart.body.id })
    .expect(200);

  expect(delCart).toBeDefined();
});
