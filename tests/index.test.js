// tests/index.test.js
//force test mode
process.env.NODE_ENV = 'test';
const request = require('supertest');
const server = require('../src/index'); // points to src/index.js

// after all tests, close the HTTP server
afterAll(() => {
  server.close();
});

describe('Custom HTTP Server', () => {
  test('GET / returns 200 and JSON body', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({ message: 'Hello World' });
  });

  test('GET /nonexistent returns 404', async () => {
    const response = await request(server).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});