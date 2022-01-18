import request from 'supertest';
import app from '../../app';

it('lists all products from cat category', async () => {
  const response = await request(app)
    .get('/api/items/category/cat-1')
    .expect(200);
  expect(response.body.length).toEqual(1);
  expect(response.body[0].category).toBeDefined();
});
