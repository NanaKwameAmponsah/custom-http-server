process.env.NODE_ENV    = 'test';
process.env.WORKER_TYPE = 'compute';

const request = require('supertest');
const server  = require('../src/index');

afterAll(() => server.close());

describe('Compute worker (bulkhead route)', () => {
  test('GET /compute  200 JSON with result', async () => {
    const res = await request(server).get('/compute');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: expect.any(Number) });
  });

  test('GET /health  200 JSON', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', pid: expect.any(Number) });
  });
});