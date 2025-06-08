process.env.API_KEY = 'lol123';
const request = require('supertest');
const server  = require('../src/index');

afterAll(() => server.close());

describe('API-Key auth', () => {
  it('rejects missing key', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('rejects wrong key', async () => {
    const res = await request(server)
      .get('/health')
      .set('x-api-key', 'wrong');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('allows correct key', async () => {
    const res = await request(server)
      .get('/health')
      .set('x-api-key', 'lol123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('pid');
  });
});