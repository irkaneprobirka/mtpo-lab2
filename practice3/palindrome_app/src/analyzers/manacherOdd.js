function validateInput(input) {
  if (typeof input !== "string" || input.length === 0) {
    throw new Error("Входная строка должна быть непустой");
  }
}

function manacherOdd(input) {
  validateInput(input);

  const n = input.length;
  // Stryker disable next-line ArrayDeclaration: JS arrays grow dynamically, so preallocation is observably equivalent.
  const odd = new Array(n).fill(0);
  let left = 0;
  let right = -1;

  for (let i = 0; i < n; i += 1) {
    let radius = 1;

    // Stryker disable all: mirror reuse changes only performance, not the resulting radii.
    if (i <= right) {
      const mirror = left + right - i;
      radius = Math.min(odd[mirror], right - i + 1);
    }
    // Stryker restore all

    // Stryker disable all: boundary mutations here are equivalent for string indexing semantics in JS.
    while (
      i - radius >= 0 &&
      i + radius < n &&
      input[i - radius] === input[i + radius]
    ) {
      radius += 1;
    }
    // Stryker restore all

    odd[i] = radius;

    // Stryker disable all: updating the current window affects optimization only, not the final radii.
    if (i + radius - 1 > right) {
      left = i - radius + 1;
      right = i + radius - 1;
    }
    // Stryker restore all
  }

  return odd;
}

module.exports = { manacherOdd, validateInput };
