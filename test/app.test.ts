import axios from 'axios';
import request from 'supertest';
import app from '../src/app';
import { dental, vet } from './dummyData';
import MockAdapter from 'axios-mock-adapter';

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

  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    mock.onGet(/vet-clinics/).reply(200, vet);
    mock.onGet(/dental-clinics/).reply(200, dental);
  });


  it('search one field', async function () {
    const response = await request(app)
      .get(SEARCH_URL)
      .query({ name: clinicToSearch.name });

    expect(response.body.data).toHaveLength(1);
  });

  it('search multiple fields', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ name: clinicToSearch.name, state: clinicToSearch.state});

    expect(response.body.data).toHaveLength(1);
  });
});