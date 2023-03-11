import request from 'supertest';

import app from '../src/app';



describe('GET /api/v1/clinics', function () {
  const CLINIC_URL = '/api/v1/clinics/search';
  it('responds with json', async function () {
    const response = await request(app)
      .get(CLINIC_URL)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
  });
  it('cannot search with no filter', async function () {
    const response = await request(app)
      .get(CLINIC_URL)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
  });
  it('search by name', async function () {
    const response = await request(app)
      .get(CLINIC_URL)
      .query({ name: 'mayo' })
      .set('Accept', 'application/json');

    expect(response.body.data).toHaveLength(1);
  });
});
