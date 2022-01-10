import request from 'supertest';
import app from '../../app';

it('lists all products', async () => {
  const response = await request(app).get('/api/items/list').expect(200);
  expect(response.body.length).toEqual(5);
});
