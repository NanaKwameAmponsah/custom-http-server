// src/service.js
// Simulates a downstream service that randomly fails or delays.

// Expose a function that simulates an unreliable downstream operation
function unreliableOperation() {
  return new Promise((resolve, reject) => {
    //  Pick a random delay up to 2000ms
    const delay = Math.random() * 2000;
    //  Succeed 70% of the time, fail 30% of the time
    const succeed = Math.random() < 0.7;

    //  After the random delay, either resolve or reject
    setTimeout(() => {
      if (succeed) {
        //  On success, return some dummy data
        resolve({ data: 'downstream data' });
      } else {
        //  On failure, reject with an Error
        reject(new Error('simulated failure'));
      }
    }, delay);
  });
}

// Make the function available to other modules
module.exports = { unreliableOperation };