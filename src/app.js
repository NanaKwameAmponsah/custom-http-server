
const http = require('http');
const router = require('./router');
const breaker = require('./breaker');
const logger = require('./logger');
const pinoHttp = require('pino-http');
const requireApiKey = require('./auth');
function makeServer() {
  const middleware = pinoHttp({ logger, genReqId: () => Date.now().toString() });
  return http.createServer(async (req, res) => {
    middleware(req, res);
    if (!requireApiKey(req,res)) return;
    // Health-check endpoint
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    }
        // Unstable endpoint with circuit breaker
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

    // Delegate all other routes to our router
    router.handle(req, res);
  });
}

module.exports = makeServer;