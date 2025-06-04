# custom-http-server
A hand-rolled Node.js HTTP server that parses raw TCP requests, implements routing & middleware, and serves static files. This repo is scaffolded with tests, Docker support, and a CI pipeline.
## Features

- TCP socket handling via Node’s built-in http & net modules
- Simple router and middleware chain
- Unit & integration tests (Jest + Supertest)
- Dockerized with a multi-stage build
- CI via GitHub Actions

## Getting Started

1. **Clone the repo**  

   git clone https://github.com/<YOUR_USERNAME>/custom-http-server.git
   cd custom-http-server
2. Install dependencies
     npm install
 3. run tests
    npm test
  4. start the server
     npm start
     (by default, the server listens on port 3000 to override do PORT = 4000 npm start
