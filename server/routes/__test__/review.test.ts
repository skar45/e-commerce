import request from 'supertest';
import app from '../../app';
import parseCookie from '../../lib/parse-cookie';

it('sucessfully adds a review to a product', async () => {
  const user = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'holabarbados@mail.com',
      username: 'test1234',
      password: 'Alfonso12@',
    })
    .expect(201);
  const cookie = parseCookie(user.headers['set-cookie'][0], 'id');
  const review = await request(app)
    .post('/api/items/review')
    .set('Cookie', [`id=${cookie}`])
    .send({
      productId: 1,
      rating: 2,
      description: 'not good',
      title: 'dissapointed',
    })
    .expect(201);

  expect(review.body.productId).toEqual(1);
});

it('throws an error when an unauthorized user posts a review', async () => {
  const review = await request(app)
    .post('/api/items/review')
    .send({
      productId: 1,
      rating: 2,
      description: 'not good',
      title: 'dissapointed',
    })
    .expect(401);

  expect(review.body).toHaveProperty('error');
});
