// src/app.js
const http = require('http');
const router = require('./router');

function makeServer() {
  return http.createServer((req, res) => {
    // Health-check endpoint
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    }

    // Delegate all other routes to our router
    router.handle(req, res);
  });
}

module.exports = makeServer;