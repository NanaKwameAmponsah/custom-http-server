const http          = require('http');
const router        = require('./router');
const breaker       = require('./breaker');
const logger        = require('./logger');
const pinoHttp      = require('pino-http');
const requireApiKey = require('./auth');

function makeServer() {
  // inject Pino into each request, generate a unique request ID
  const middleware = pinoHttp({
    logger,
    genReqId: () => Date.now().toString()
  });

  return http.createServer(async (req, res) => {
    // 1) run structured-logging middleware
    middleware(req, res);

    // 2) enforce API-key on every route except when running tests
    if (process.env.NODE_ENV !== 'test') {
      if (!requireApiKey(req, res)) {
        // requireApiKey has already sent the 401 response
        return;
      }
    }

    // 3) Health-check endpoint
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    }

    // 4) Unstable endpoint with circuit breaker
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

    // 5) All other routes go through your router
    router.handle(req, res);
  });
}

module.exports = makeServer;