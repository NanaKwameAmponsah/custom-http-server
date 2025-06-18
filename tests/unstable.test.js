// tests/unstable.test.js
process.env.API_KEY = 'testkey';
process.env.NODE_ENV = 'test';
const request = require('supertest');
const server = require('../src/index');
// stub the unreliable service
jest.mock('../src/service', () => ({
  unreliableOperation: jest.fn(),
}));
const { unreliableOperation } = require('../src/service');

afterAll(() => server.close());

describe('Circuit Breaker /unstable endpoint', () => {
  it('returns 200 and result when service resolves', async () => {
    unreliableOperation.mockResolvedValue(123);
    const res = await request(server)
      .get('/unstable')
      .set('x-api-key', 'testkey');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, result: 123 });
  });

  it('returns 503 and error when service rejects', async () => {
    unreliableOperation.mockRejectedValue(new Error('boom'));
    const res = await request(server)
      .get('/unstable')
      .set('x-api-key', 'testkey');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ ok: false, error: 'boom' });
  });

  it('stays open for resetTimeout and then resets', async () => {
    jest.useFakeTimers();
    // force failures to trip the breaker (threshold 50% => 2 failures)
    unreliableOperation.mockRejectedValue(new Error('fail'));
    await request(server).get('/unstable').set('x-api-key', 'testkey');
    await request(server).get('/unstable').set('x-api-key', 'testkey');
    // circuit now open: should immediately reject
    let res = await request(server).get('/unstable').set('x-api-key', 'testkey');
    expect(res.status).toBe(503);
    // advance less than resetTimeout (5000ms)
    jest.advanceTimersByTime(3000);
    res = await request(server).get('/unstable').set('x-api-key', 'testkey');
    expect(res.status).toBe(503);
    // advance past resetTimeout
    jest.advanceTimersByTime(3000);
    // next call attempts again and fails
    res = await request(server).get('/unstable').set('x-api-key', 'testkey');
    expect(res.status).toBe(503);
    jest.useRealTimers();
  });
});