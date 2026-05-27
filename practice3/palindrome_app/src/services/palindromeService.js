const { manacherOdd } = require("../analyzers/manacherOdd");
const { manacherEven } = require("../analyzers/manacherEven");
const { centerExpansion, expandAroundCenter } = require("../analyzers/centerExpansion");

function sum(values) {
  return values.reduce((accumulator, value) => accumulator + value, 0);
}

function buildRecommendation(input, longestPalindrome) {
  if (longestPalindrome.length === input.length) {
    return "Строка целиком является палиндромом.";
  }

  if (longestPalindrome.length >= Math.ceil(input.length * 0.6)) {
    return "Строка содержит крупный палиндромный фрагмент.";
  }

  if (longestPalindrome.length <= 2) {
    return "В строке преобладают только короткие палиндромы.";
  }

  return "Строка содержит несколько локальных палиндромных областей.";
}

function findLongestPalindrome(input, odd, even) {
  let best = { start: 0, end: 0, length: 1, value: input[0] };

  // Stryker disable next-line EqualityOperator: the extra terminal iteration cannot improve the best palindrome.
  for (let i = 0; i < input.length; i += 1) {
    const oddLength = odd[i] * 2 - 1;
    if (oddLength > best.length) {
      const start = i - odd[i] + 1;
      const end = i + odd[i] - 1;
      best = { start, end, length: oddLength, value: input.slice(start, end + 1) };
    }

    const evenLength = even[i] * 2;
    if (evenLength > best.length) {
      const start = i - even[i];
      const end = i + even[i] - 1;
      best = { start, end, length: evenLength, value: input.slice(start, end + 1) };
    }
  }

  return best;
}

function buildAnalysisResult(input, oddRadii, evenRadii, algorithm) {
  const longestPalindrome = findLongestPalindrome(input, oddRadii, evenRadii);

  return {
    algorithm,
    input,
    oddRadii,
    evenRadii,
    longestPalindrome,
    palindromeCount: sum(oddRadii) + sum(evenRadii),
    recommendation: buildRecommendation(input, longestPalindrome)
  };
}

function collectCenterExpansionRadii(input) {
  const oddRadii = [];
  const evenRadii = [];

  for (let i = 0; i < input.length; i += 1) {
    const odd = expandAroundCenter(input, i, i);
    const even = expandAroundCenter(input, i - 1, i);

    oddRadii.push((odd.length + 1) / 2);
    evenRadii.push(even.length / 2);
  }

  return { oddRadii, evenRadii };
}

function analyzeWithCenterExpansion(input, collaborators = {}) {
  const radiiCollector = collaborators.radiiCollector || collectCenterExpansionRadii;
  const referenceExpansion = collaborators.referenceExpansion || centerExpansion;
  const { oddRadii, evenRadii } = radiiCollector(input);
  const result = buildAnalysisResult(input, oddRadii, evenRadii, "center-expansion");
  const reference = referenceExpansion(input);

  if (
    reference.value !== result.longestPalindrome.value ||
    reference.length !== result.longestPalindrome.length
  ) {
    throw new Error("Эталонный анализ расширением от центра сформирован некорректно");
  }

  return result;
}

function analyzeString(input, collaborators = {}) {
  const oddAnalyzer = collaborators.oddAnalyzer || manacherOdd;
  const evenAnalyzer = collaborators.evenAnalyzer || manacherEven;
  const referenceAnalyzer = collaborators.referenceAnalyzer || analyzeWithCenterExpansion;
  const oddRadii = oddAnalyzer(input);
  const evenRadii = evenAnalyzer(input);
  const result = buildAnalysisResult(input, oddRadii, evenRadii, "manacher");
  const reference = referenceAnalyzer(input);

  if (
    reference.longestPalindrome.value !== result.longestPalindrome.value ||
    reference.longestPalindrome.length !== result.longestPalindrome.length ||
    reference.palindromeCount !== result.palindromeCount
  ) {
    throw new Error("Результаты алгоритмов не совпадают");
  }

  return {
    ...result,
    comparison: {
      referenceAlgorithm: "center-expansion",
      matches: true
    }
  };
}

module.exports = {
  analyzeString,
  analyzeWithCenterExpansion,
  buildAnalysisResult,
  buildRecommendation,
  collectCenterExpansionRadii,
  findLongestPalindrome,
  sum
};
