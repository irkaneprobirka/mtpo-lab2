function decodePercentInput(input) {
  const decoded = decodeURIComponent(input);

  return decoded;
}

function decodeAndAnalyze(input, analyzer) {
  const decoded = decodePercentInput(input);
  return analyzer(decoded);
}

function classifyDecodedInput(input) {
  switch (input.length) {
    case 0:
      return "short";
    case 1:
      return "short";
    default:
      return "long";
  }
}

module.exports = { decodePercentInput, decodeAndAnalyze, classifyDecodedInput };
