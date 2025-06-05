// src/index.js
const cluster = require('cluster');
const os = require('os');
const makeServer = require('./app');
const PORT = process.env.PORT || 3000;

// 1) If NODE_ENV === 'test', skip clustering and export a plain server for Supertest
if (process.env.NODE_ENV === 'test') {
  const server = makeServer();
  module.exports = server;
}else if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new worker.`);
    cluster.fork();
  });
} else {
  // Worker: create + listen on the server instance
  const server = makeServer();

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
    
    setTimeout(() => {
      console.error(`Worker ${process.pid} shutting down forcefully.`);
      process.exit(1);
    }, 5000);
  });
}