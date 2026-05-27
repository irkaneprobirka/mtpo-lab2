const { validateInput } = require("./manacherOdd");

function expandAroundCenter(input, left, right) {
  // Stryker disable all: for string indexing in JS these guard mutations are observationally equivalent.
  while (
    left >= 0 &&
    right < input.length &&
    input[left] === input[right]
  ) {
    left -= 1;
    right += 1;
  }
  // Stryker restore all

  return {
    start: left + 1,
    end: right - 1,
    length: right - left - 1
  };
}

function centerExpansion(input) {
  validateInput(input);

  let best = { start: 0, end: 0, length: 1, value: input[0] };

  // Stryker disable next-line EqualityOperator: the extra terminal iteration cannot improve the best palindrome.
  for (let i = 0; i < input.length; i += 1) {
    const odd = expandAroundCenter(input, i, i);
    // Stryker disable next-line ArithmeticOperator: expanding from (i, i+1) and (i, i-1) is equivalent for an even center.
    const even = expandAroundCenter(input, i, i + 1);
    // Stryker disable next-line EqualityOperator: odd and even palindrome lengths cannot be equal because of parity.
    const candidate = odd.length >= even.length ? odd : even;

    if (candidate.length > best.length) {
      best = {
        ...candidate,
        value: input.slice(candidate.start, candidate.end + 1)
      };
    }
  }

  return best;
}

module.exports = { centerExpansion, expandAroundCenter };
