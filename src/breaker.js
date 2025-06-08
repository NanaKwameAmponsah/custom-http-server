const CircuitBreaker = require('opossum');
const { unreliableOperation } = require('./service');

// Configure the breaker
const options = {
  timeout: 1000,           // If service takes >1s, consider it a failure
  errorThresholdPercentage: 50,  // When 50% of calls fail, open the circuit
  resetTimeout: 5000       // After 5s, try the service again
};
// Create a circuit breaker around unreliableOperation
const breaker = new CircuitBreaker(unreliableOperation, options);

// Optional: listen to circuit events for logging/metrics
breaker.on('open',    () => console.warn('Breaker opened!'));
breaker.on('halfOpen',() => console.info('Breaker half-open.'));
breaker.on('close',   () => console.info('Breaker closed.'));
breaker.on('fallback',() => console.info('Calling fallback.'));
//export the configured breaker
module.exports = breaker;