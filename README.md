# custom-http-server
A hand-rolled Node.js HTTP server that parses raw TCP requests, implements routing & middleware patterns, resilliency, bulkheads, structured logging, and basic security.
## Features

- **Clustering & Zero-Downtime Restarts**  
  Master process forks I/O vs. compute workers, health-checks, graceful shutdown.
- **Resiliency Patterns**  
  Circuit-breaker (`Opossum`) around unstable “downstream” code.
- **Bulkheads**  
  Separate worker pools for CPU-bound `/compute` vs. I/O routes.
- **Structured JSON Logging**  
  [Pino](https://github.com/pinojs/pino) with request IDs, timestamps, levels.
- **API-Key Authentication**  
  Simple middleware guarding all HTTP endpoints (`x-api-key` header).
- **Static File Serving**  
  Lightweight middleware to serve assets from `/public`.
- **Testing**  
  Jest + Supertest covering all routes, auth, and bulkhead logic.
- **Dockerized**  
  Multi-stage `Dockerfile` for small images; CI build & push.
- **CI via GitHub Actions**  
  Lint, build, test, and Docker image publish on every PR.


## Getting Started

### Prerequisites

- Node.js ≥ 16  
- npm or yarn  
- (Optional) Docker & Docker Compose

 **Clone the repo**  
git clone https://github.com/NanaKwameAmponsah/custom-http-server.git
cd custom-http-server
**Install dependencies**
     npm install
 **run tests**
 # set API_KEY so auth tests pass
export API_KEY=supersecret123    # macOS/Linux
$env:API_KEY='supersecret123'    # PowerShell
npm test
**Docker**
docker build -t custom-http-server:latest .
docker run -e API_KEY=supersecret123 -p 3000:3000 custom-http-server:latest
**CI/CD**
npm ci, npm test, build & push docker image run on every pull request/merge




  
