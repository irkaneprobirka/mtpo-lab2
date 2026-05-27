function generateStrings(maxLength, alphabet = ["a", "b"]) {
  const results = [];

  function build(prefix) {
    if (prefix.length > 0) {
      results.push(prefix);
    }

    if (prefix.length === maxLength) {
      return;
    }

    for (const symbol of alphabet) {
      build(prefix + symbol);
    }
  }

  build("");
  return results;
}

function isPalindrome(value) {
  return value === value.split("").reverse().join("");
}

function bruteForceOddRadii(input) {
  return input.split("").map((_, index) => {
    let radius = 1;

    while (
      index - radius >= 0 &&
      index + radius < input.length &&
      input[index - radius] === input[index + radius]
    ) {
      radius += 1;
    }

    return radius;
  });
}

function bruteForceEvenRadii(input) {
  return input.split("").map((_, index) => {
    let radius = 0;

    while (
      index - radius - 1 >= 0 &&
      index + radius < input.length &&
      input[index - radius - 1] === input[index + radius]
    ) {
      radius += 1;
    }

    return radius;
  });
}

function bruteForceLongestPalindrome(input) {
  let best = { start: 0, end: 0, length: 1, value: input[0] };

  for (let start = 0; start < input.length; start += 1) {
    for (let end = start; end < input.length; end += 1) {
      const candidate = input.slice(start, end + 1);

      if (candidate.length > best.length && isPalindrome(candidate)) {
        best = {
          start,
          end,
          length: candidate.length,
          value: candidate
        };
      }
    }
  }

  return best;
}

function bruteForceAnalysis(input) {
  const oddRadii = bruteForceOddRadii(input);
  const evenRadii = bruteForceEvenRadii(input);

  return {
    oddRadii,
    evenRadii,
    longestPalindrome: bruteForceLongestPalindrome(input),
    palindromeCount: oddRadii.reduce((sum, value) => sum + value, 0) +
      evenRadii.reduce((sum, value) => sum + value, 0)
  };
}

module.exports = {
  bruteForceAnalysis,
  bruteForceEvenRadii,
  bruteForceLongestPalindrome,
  bruteForceOddRadii,
  generateStrings
};
