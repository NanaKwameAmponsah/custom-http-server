# custom-http-server

A hand-rolled Node.js HTTP/TCP server that parses raw TCP requests, implements routing & middleware patterns, resiliency, bulkheads, structured logging, and basic security.

## Features

- **Clustering & Zero-Downtime Restarts**  
  Master forks I/O vs. compute workers, health-checks, graceful shutdown.

- **Resiliency Patterns**  
  Circuit-breaker (Opossum) around unstable “downstream” code.

- **Bulkheads**  
  Separate worker pools/processes for CPU-bound `/compute` vs. I/O routes.

- **Structured JSON Logging**  
  Pino with request IDs, timestamps, and levels.

- **API-Key Authentication**  
  Simple middleware guarding all HTTP endpoints via the `x-api-key` header.

- **Static File Serving**  
  Lightweight middleware to serve assets from `/public`.

- **Testing**  
  Jest + Supertest covering all routes, auth, and bulkhead logic.

- **Dockerized**  
  Multi-stage `Dockerfile` for minimal images; CI build & push.

- **CI via GitHub Actions**  
  Lint, test, build, and Docker image publish on every PR.

## Getting Started

### Prerequisites

- Node.js ≥ 16  
- npm or yarn  
- Docker

### Installation

- git clone https://github.com/NanaKwameAmponsah/custom-http-server.git
- cd custom-http-server
- npm install
## Configuration

Set your API key so that auth tests pass and production requires it:

### macOS / Linux
export API_KEY=supersecret123
### Windows PowerShell
$env:API_KEY = 'supersecret123'
## Running the Server
By default, listens on port 3000. To override, for example:

PORT=4000 npm start
## Testing
npm test
## Docker
### build the image:
- docker build -t custom-http-server: latest .
- docker run --rm -e API_KEY=[insert your API_KEY] -p 3000:3000 custom-http-server:latest
## CI/CD 
### On every push/PR to main, GitHub Actions will:
-Checkout, install, lint, test

-Build Docker image & tag :latest

-Run smoke-tests against /health and /compute
### Make sure you’ve added these Secrets under your repo’s Settings → Secrets → Actions:
-API_KEY 
-DOCKER_USERNAME
-DOCKER_PASSWORD
## Troubleshooting
### Port already in use (EADDRINUSE):
-Either kill the process listening on that port or change PORT.
- **macOS / Linux**  
  ### Find PID listening on 3000
  lsof -i :3000

  ### Kill that PID (replace <PID>)
  kill -9 <PID>
- **Windows PowerShell**
  ### Find PID
  Get-NetTCPConnection -LocalPort 3000 | Select-Object -Expand OwningProcess
  
  ### Kill process
  Stop-Process -Id <PID> -Force
### Docker “port already allocated” errors:
-**List running containers**:
  -docker ps

-**Stop & remove container (replace <CONTAINER_ID>)**:
  -docker stop <CONTAINER_ID>
  -docker rm <CONTAINER_ID>
### unauthorized on every request errors: 
-Make sure your shell’s API_KEY matches the one in CI/tests:
- **macOS / Linux**:
-   export API_KEY=supersecret123
- **windows/ PowerShell**
-   $env:API_KEY = 'supersecret123'
- **Then restart the server**
-   npm start

