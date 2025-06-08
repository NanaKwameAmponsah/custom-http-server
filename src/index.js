const cluster       = require('cluster');
const os            = require('os');
const http          = require('http');
const logger = require('./logger');
const makeServer    = require('./app');
const { heavyCompute } = require('./compute');
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'test') {
  // ─── Test mode: export a single-server instance ───
  let server;
  const type = process.env.WORKER_TYPE || 'io';

  if (type === 'compute') {
    server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/compute') {
        const output = heavyCompute();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(output));
      }
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });
  } else {
    server = makeServer();
  }

  module.exports = server;

} else if (cluster.isMaster) {
  // ─── Production master: fork I/O vs compute workers ───
  const numCPUs = os.cpus().length;
  logger.info({pid: process.pid}, 'master process running');

  const ioCount = Math.floor(numCPUs / 2);
  for (let i = 0; i < ioCount; i++) {
    cluster.fork({ WORKER_TYPE: 'io' });
  }
  for (let i = ioCount; i < numCPUs; i++) {
    cluster.fork({ WORKER_TYPE: 'compute' });
  }

  cluster.on('exit', (worker, code, signal) => {
    const type = (worker.env && worker.env.WORKER_TYPE) || 'io';
    logger.warn({pid: worker.process.pid, type}, 'worker died; restarting');
    cluster.fork({ WORKER_TYPE: type });
  });

} else {
  // ─── Production worker: pick I/O or compute mode ───
  const type = process.env.WORKER_TYPE || 'io';
  let server;

  if (type === 'compute') {
    server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/compute') {
        const output = heavyCompute();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(output));
      }
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });
  } else {
    server = makeServer();
  }
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      logger.error({ port: PORT, err }, 'Port already in use, shutting down');
      process.exit(1);
    } else {
      // re-throw any other errors
      throw err;
    }
  });
  server.listen(PORT, () => {
    logger.info({pid: process.pid, type, port: PORT}, 'worker listening');
  });

  process.on('SIGTERM', () => {
    logger.info({ pid: process.pid, type }, 'SIGTERM received; shutting down');
    server.close(() => {
      logger.info({ pid: process.pid, type }, 'graceful shutdown complete');
      process.exit(0);
    });
  setTimeout(() => process.exit(1), 5000);
 });
}
