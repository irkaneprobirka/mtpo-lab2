function repeatToLength(pattern, length) {
  return pattern.repeat(Math.ceil(length / pattern.length)).slice(0, length);
}

function generateDataset(type, length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Dataset length must be a positive integer");
  }

  switch (type) {
    case "uniform":
      return "a".repeat(length);
    case "alternate":
      return repeatToLength("ab", length);
    case "mirror": {
      const half = repeatToLength("abcddcba", Math.ceil(length / 2));
      return (half + half.split("").reverse().join("")).slice(0, length);
    }
    case "random-like":
      return repeatToLength("qwertyuiopasdfghjklzxcvbnm", length);
    default:
      throw new Error(`Unknown dataset type: ${type}`);
  }
}

module.exports = { generateDataset };
