// src/index.js
const http = require('http');
const router = require('./router');

const PORT = process.env.PORT || 3000;

// Create the server and start listening immediately.
const server = http.createServer((req, res) => {
  router.handle(req, res);
});
if (require.main === module){
    server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });
}
// Export the server object so Supertest can use it in tests
module.exports = server;