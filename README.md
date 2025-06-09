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
- (Optional) Docker & Docker Compose

### Installation

- git clone https://github.com/NanaKwameAmponsah/custom-http-server.git
- cd custom-http-server
- npm install
## Configuration

Set the API key so that auth tests pass and production requires it:

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
- docker run -e API_KEY=supersecret123 -p 3000:3000 custom-http-server:latest
## CI/CD 
on every pull request, github actions will lint, test, build, and push your docker image


