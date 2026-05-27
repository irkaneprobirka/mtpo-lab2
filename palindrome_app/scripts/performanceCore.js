const { performance } = require("perf_hooks");
const { manacherOdd } = require("../src/analyzers/manacherOdd");
const { manacherEven } = require("../src/analyzers/manacherEven");
const { buildAnalysisResult } = require("../src/services/palindromeService");
const { centerExpansion } = require("../src/analyzers/centerExpansion");

function timeCall(callback) {
  const startedAt = performance.now();
  const value = callback();
  return {
    value,
    ms: performance.now() - startedAt
  };
}

function runManacher(input) {
  const odd = manacherOdd(input);
  const even = manacherEven(input);
  return buildAnalysisResult(input, odd, even, "manacher");
}

function measureAlgorithms(input) {
  const manacher = timeCall(() => runManacher(input));
  const center = timeCall(() => centerExpansion(input));

  return {
    length: input.length,
    manacher: {
      ms: manacher.ms,
      longest: manacher.value.longestPalindrome.value
    },
    center: {
      ms: center.ms,
      longest: center.value.value
    },
    memoryMb: process.memoryUsage().heapUsed / 1024 / 1024
  };
}

module.exports = { measureAlgorithms, runManacher };
