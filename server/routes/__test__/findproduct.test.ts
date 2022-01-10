import request from 'supertest';
import app from '../../app';

it('finds a product', async () => {
  const response = await request(app).get('/api/items/id/1').expect(200);
  expect(response.body.id).toEqual(1);
});

it('throws a 404 if the peoduct does not exist', async () => {
  const response = await request(app).get('/api/items/id/200').expect(404);
  expect(response.body).toHaveProperty('error');
});
