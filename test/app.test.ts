import request from 'supertest';
import app from '../src/app';
import { dental, vet } from './dummyData';

const SEARCH_URL = '/api/v1/clinics/search';

const clinicToSearch = {
  name: 'Mayo Clinic',
  state: 'Florida',
  availability: {
    from: '09:00',
    to: '20:00',
  },
};

describe('GET /api/v1/clinics/search', function () {

  const client = request(app)
    .get(SEARCH_URL);

  it('responds with json', async function () {
    const response = await client;

    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('search without filter must fail', async function () {
    const response = await client;

    expect(response.status).toEqual(400);
  });

});

describe('Search tests', function () {
  it('search one field', async function () {
    const response = await request(app)
      .get(SEARCH_URL)
      .query({ name: 'mayo' });

    expect(response.body.data).toHaveLength(1);
  });

  it('search multiple fields', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ name: 'mayo', state: 'Florida' });

    expect(response.body.data).toHaveLength(1);
  });
});