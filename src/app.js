// src/app.js
const http          = require('http');
const router        = require('./router');
const breaker       = require('./breaker');
const logger        = require('./logger');
const pinoHttp      = require('pino-http');
const requireApiKey = require('./auth');

function makeServer() {
  // 1) structured logging via Pino
  const middleware = pinoHttp({
    logger,
    genReqId: () => Date.now().toString(),
  });

  return http.createServer(async (req, res) => {
    // attach logger & request ID
    middleware(req, res);

    // 2) enforce API-key on every request
    if (!requireApiKey(req, res)) {
      // requireApiKey already did res.writeHead(401)…res.end()
      return;
    }

    // 3) Health-check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    }

    // 4) Unstable endpoint (circuit breaker)
    if (req.method === 'GET' && req.url === '/unstable') {
      try {
        const result = await breaker.fire();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, result }));
      } catch (err) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    }

    // 5) delegate everything else to your router
    router.handle(req, res);
  });
}

module.exports = makeServer;