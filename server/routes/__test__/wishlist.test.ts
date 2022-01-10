import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

it("adds an item to the user's wish list", async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');
  const wishlist = await request(app)
    .post('/api/items/wishlist')
    .set('Cookie', [`id=${cookie}`])
    .send({ productId: 1 })
    .expect(201);
  expect(wishlist.body.productId).toEqual(1);
});

it("throws an error when an unauthorized agent adds an item to the user's wish list", async () => {
  const wishlist = await request(app)
    .post('/api/items/wishlist')
    .send({ productId: 1 })
    .expect(401);
  expect(wishlist.body).toHaveProperty('error');
});
