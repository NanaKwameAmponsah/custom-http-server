// tests/metrics.test.js
process.env.API_KEY = 'testkey';
process.env.NODE_ENV = 'test';
const request = require('supertest');
const server = require('../src/index');
afterAll(() => server.close());

describe('/metrics stub endpoint', () => {
  it('returns 200 text/plain', async () => {
    const res = await request(server)
      .get('/metrics')
      .set('x-api-key', 'testkey');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
  });
});
