import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

it("successfully sign's out the user", async () => {
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
    .get('/api/user/signout')
    .set('Cookie', [`id=${cookie}`])
    .expect(200);

  const signoutCookie = parseCookie(response.headers['set-cookie'][0], 'id');
  expect(signoutCookie).toBeUndefined();
});
