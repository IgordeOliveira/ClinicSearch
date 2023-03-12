import axios from 'axios';
import request from 'supertest';
import app from '../src/app';
import { dental, vet } from './dummyData';
import MockAdapter from 'axios-mock-adapter';
import { isOpen } from '../src/services/clinicService';

const SEARCH_URL = '/api/v1/clinics/search';


const clinicToSearch = {
  name: 'Mayo Clinic',
  state: 'Florida',
  availability: {
    from: '09:00',
    to: '20:00',
  },
};


const mock = new MockAdapter(axios);


describe('GET /api/v1/clinics/search', function () {

  beforeEach(() => {
    mock.reset();
    mock.onGet(/vet-clinics/).reply(200, vet);
    mock.onGet(/dental-clinics/).reply(200, dental);
  });

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

  beforeEach(() => {
    mock.reset();
    mock.onGet(/vet-clinics/).reply(200, vet);
    mock.onGet(/dental-clinics/).reply(200, dental);
  });

  it('misspelled field', async function () {
    const response = await request(app)
      .get(SEARCH_URL)
      .query({ misspelled: 'none' });

    expect(response.body).toStrictEqual({ error: 'NO_SEARCH_PARAMS' });
  });

  it('name field', async function () {
    const response = await request(app)
      .get(SEARCH_URL)
      .query({ name: clinicToSearch.name });

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toStrictEqual(clinicToSearch);
  });

  it('state field', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ state: clinicToSearch.state });

    expect(response.body.data).toHaveLength(2);
  });

  it('from field', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ from: '09:00' });

    expect(response.body).toStrictEqual({ error: 'MUST_HAVE_FROM_AND_TO' });

  });

  it('to field', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ to: '20:00' });

    expect(response.body).toStrictEqual({ error: 'MUST_HAVE_FROM_AND_TO' });

  });

  it('availability (from/to) field', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ from: '09:00', to: '20:00' });

    response.body.data.forEach((clinic: { availability: { from: string; to: string; }; }) => {
      const clinicIsOpen = isOpen(clinic.availability, '09:00', '20:00');
      expect(clinicIsOpen).toBeTruthy();
    });
  });

  it('all fields', async function () {
    const response = await await request(app)
      .get(SEARCH_URL)
      .query({ name: clinicToSearch.name, state: clinicToSearch.state, from: clinicToSearch.availability.from, to: clinicToSearch.availability.to });

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toStrictEqual(clinicToSearch);

  });
});