// tests/edge.test.js
process.env.API_KEY = 'testkey';
process.env.NODE_ENV = 'test';
const request = require('supertest');
const server = require('../src/index');
afterAll(() => server.close());

describe('Edge-case HTTP methods', () => {
  it('POST /health returns 404', async () => {
    const res = await request(server)
      .post('/health')
      .set('x-api-key', 'testkey');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('DELETE /compute returns 404', async () => {
    const res = await request(server)
      .delete('/compute')
      .set('x-api-key', 'testkey');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });
});