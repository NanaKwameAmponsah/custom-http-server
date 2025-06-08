// A dummy CPU‐bound task: sums numbers up to N
function heavyCompute() {
  const N = 5e7;                // tweak this to taste
  let sum = 0;
  for (let i = 0; i < N; i++) {
    sum += i;
  }
  return { result: sum };
}

module.exports = { heavyCompute };