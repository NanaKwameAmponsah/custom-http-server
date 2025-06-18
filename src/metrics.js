// src/metrics.js
const client   = require('prom-client');
const register = client.register;

client.collectDefaultMetrics({ prefix: 'custom_http_server_' });

// our two Prom metrics
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method','route','status'],
});

const httpLatency = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method','route','status'],
  buckets: [0.005,0.01,0.05,0.1,0.5,1,5],
});

// middleware to wrap each request
function metricsMiddleware(req, res, next) {
  const end = httpLatency.startTimer();
  res.once('finish', () => {
    httpRequests.labels(req.method, req.url, res.statusCode).inc();
    end({ method: req.method, route: req.url, status: res.statusCode });
  });
  next();
}

// the /metrics handler must END only *after* the promise resolves
async function metricsHandler(req, res) {
  try {
    const body = await register.metrics();       // ← await the promise
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(err.message);
  }
}

module.exports = { metricsMiddleware, metricsHandler, register };