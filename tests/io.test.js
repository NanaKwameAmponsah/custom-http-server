process.env.NODE_ENV   = 'test';
process.env.WORKER_TYPE = 'io';

const request = require('supertest');
const server  = require('../src/index');

afterAll(() => server.close());

describe('I/O worker (routes)', () => {
  test('GET /health  200 JSON', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', pid: expect.any(Number) });
  });

  test('GET /compute  404', async () => {
    const res = await request(server).get('/compute');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });
});