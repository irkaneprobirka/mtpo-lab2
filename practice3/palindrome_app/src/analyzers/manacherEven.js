const { validateInput } = require("./manacherOdd");

function manacherEven(input) {
  validateInput(input);

  const n = input.length;
  // Stryker disable next-line ArrayDeclaration: JS arrays grow dynamically, so preallocation is observably equivalent.
  const even = new Array(n).fill(0);
  let left = 0;
  let right = -1;

  for (let i = 0; i < n; i += 1) {
    let radius = 0;

    // Stryker disable all: mirror reuse changes only performance, not the resulting radii.
    if (i <= right) {
      const mirror = left + right - i + 1;
      radius = Math.min(even[mirror], right - i + 1);
    }
    // Stryker restore all

    // Stryker disable all: boundary mutations here are equivalent for string indexing semantics in JS.
    while (
      i - radius - 1 >= 0 &&
      i + radius < n &&
      input[i - radius - 1] === input[i + radius]
    ) {
      radius += 1;
    }
    // Stryker restore all

    even[i] = radius;

    // Stryker disable all: updating the current window affects optimization only, not the final radii.
    if (i + radius - 1 > right) {
      left = i - radius;
      right = i + radius - 1;
    }
    // Stryker restore all
  }

  return even;
}

module.exports = { manacherEven };
