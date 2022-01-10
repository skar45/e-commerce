import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

it('returns null when the cookie session is invalid or null and cart cookie is empty', async () => {
  const response = await request(app).get('/api/user/currentuser').expect(200);

  expect(response.body).toBeNull();
});

it('returns cart info when cart session is sent', async () => {
  const addCart = await request(app)
    .post('/api/items/add')
    .send({ productId: 2, amount: 2 })
    .expect(200);

  const cookie = parseCookie(addCart.headers['set-cookie'][0], 'cart');
  const response = await request(app)
    .get('/api/user/currentuser')
    .set('Cookie', [`cart=${cookie!}`])
    .expect(200);

  expect(response.body.ListItem[2]).toBeDefined();
  expect(response.body.id).toBeUndefined();
});

it('returns userinfo when login session is sent', async () => {
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
    .get('/api/user/currentuser')
    .set('Cookie', [`id=${cookie!}`])
    .expect(200);
  expect(response.body.id).toBeDefined();
});

// it("returns null when the user doesn't exist in the database", async () => {
//   const cookie = signin()
//   const response = await request(app).get('/api/user/currentuser').set('Cookie', cookie).expect(200);
//   expect(response.body.id).toBeDefined()
// })
