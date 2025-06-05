// src/index.js
const cluster = require('cluster');
const os = require('os');
const http = require('http');
const router = require('./router');

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  // Master process: fork one worker per CPU core
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker dies, immediately spawn a replacement
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new worker.`);
    cluster.fork();
  });
} else {
  // Worker processes: each creates an HTTP server 
  const server = http.createServer((req, res) => {
    // Health-check endpoint
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    }

    // Delegate all other routes to our router
    router.handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });

  // Graceful shutdown on SIGTERM
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} received SIGTERM, shutting down gracefully...`);
    server.close(() => {
      console.log(`Worker ${process.pid} closed all connections.`);
      process.exit(0);
    });

    // Force-exit if still open after 5 seconds
    setTimeout(() => {
      console.error(`Worker ${process.pid} shutting down forcefully.`);
      process.exit(1);
    }, 5000);
  });
}