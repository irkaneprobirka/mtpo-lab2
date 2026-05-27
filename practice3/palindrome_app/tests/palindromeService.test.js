const { expect } = require("chai");
const {
  analyzeString,
  analyzeWithCenterExpansion,
  buildRecommendation,
  collectCenterExpansionRadii,
  findLongestPalindrome,
  sum
} = require("../src/services/palindromeService");
const {
  bruteForceAnalysis,
  generateStrings
} = require("./helpers/palindromeOracle");

describe("palindromeService", () => {
  test("находит наибольший нечетный палиндром", () => {
    const result = analyzeString("abacaba");

    expect(result.longestPalindrome.value).to.equal("abacaba");
    expect(result.longestPalindrome.length).to.equal(7);
    expect(result.palindromeCount).to.equal(12);
  });

  test("находит наибольший четный палиндром", () => {
    const result = analyzeString("abba");

    expect(result.longestPalindrome.value).to.equal("abba");
    expect(result.longestPalindrome.length).to.equal(4);
  });

  test("возвращает служебные поля сравнения и подстроку для неполного палиндрома", () => {
    const result = analyzeString("cabbaq");

    expect(result.algorithm).to.equal("manacher");
    expect(result.longestPalindrome).to.deep.equal({
      value: "abba",
      start: 1,
      end: 4,
      length: 4
    });
    expect(result.comparison).to.deep.equal({
      referenceAlgorithm: "center-expansion",
      matches: true
    });
  });

  test("формирует сопоставимый отчет для расширения от центра", () => {
    const result = analyzeWithCenterExpansion("abba");

    expect(result.algorithm).to.equal("center-expansion");
    expect(result.longestPalindrome.value).to.equal("abba");
    expect(result.palindromeCount).to.equal(6);
  });

  test("корректно восстанавливает массивы радиусов для эталонного алгоритма", () => {
    const { oddRadii, evenRadii } = collectCenterExpansionRadii("abba");

    expect(oddRadii).to.deep.equal([1, 1, 1, 1]);
    expect(evenRadii).to.deep.equal([0, 0, 2, 0]);
  });

  test("корректно восстанавливает палиндром по радиусам", () => {
    const best = findLongestPalindrome("abba", [1, 1, 1, 1], [0, 0, 2, 0]);

    expect(best).to.deep.equal({
      value: "abba",
      start: 0,
      end: 3,
      length: 4
    });
  });

  test("формирует рекомендацию о полной симметрии", () => {
    const recommendation = buildRecommendation("level", {
      value: "level",
      length: 5
    });

    expect(recommendation).to.equal("Строка целиком является палиндромом.");
  });

  test("формирует рекомендацию о крупном палиндромном фрагменте", () => {
    const recommendation = buildRecommendation("abaxyz", {
      value: "abax",
      length: 4
    });

    expect(recommendation).to.equal("Строка содержит крупный палиндромный фрагмент.");
  });

  test("формирует рекомендацию о коротких палиндромах", () => {
    const recommendation = buildRecommendation("abcd", {
      value: "a",
      length: 1
    });

    expect(recommendation).to.equal("В строке преобладают только короткие палиндромы.");
  });

  test("относит палиндром длины 2 к коротким палиндромам", () => {
    const recommendation = buildRecommendation("aabb", {
      value: "aa",
      length: 2
    });

    expect(recommendation).to.equal("В строке преобладают только короткие палиндромы.");
  });

  test("формирует рекомендацию о локальных палиндромных областях", () => {
    const recommendation = buildRecommendation("abaxyzz", {
      value: "aba",
      length: 3
    });

    expect(recommendation).to.equal("Строка содержит несколько локальных палиндромных областей.");
  });

  test("суммирует радиусы палиндромов", () => {
    expect(sum([1, 2, 3])).to.equal(6);
    expect(sum([0, 0, 0])).to.equal(0);
  });

  test("выбрасывает ошибку для пустой строки", () => {
    expect(() => analyzeString("")).to.throw("Входная строка должна быть непустой");
  });

  test("совпадает с независимым oracle на полном наборе коротких строк", () => {
    for (const input of generateStrings(6)) {
      const result = analyzeString(input);
      const oracle = bruteForceAnalysis(input);

      expect(result.oddRadii).to.deep.equal(oracle.oddRadii);
      expect(result.evenRadii).to.deep.equal(oracle.evenRadii);
      expect(result.longestPalindrome).to.deep.equal(oracle.longestPalindrome);
      expect(result.palindromeCount).to.equal(oracle.palindromeCount);
    }
  });

  test("выбрасывает ошибку при рассогласовании эталонного алгоритма по значению", () => {
    expect(() =>
      analyzeWithCenterExpansion("abba", {
        referenceExpansion: () => ({ value: "zzzz", length: 4 })
      })
    ).to.throw("Эталонный анализ расширением от центра сформирован некорректно");
  });

  test("выбрасывает ошибку при рассогласовании эталонного алгоритма по длине", () => {
    expect(() =>
      analyzeWithCenterExpansion("abba", {
        referenceExpansion: () => ({ value: "abba", length: 3 })
      })
    ).to.throw("Эталонный анализ расширением от центра сформирован некорректно");
  });

  test("выбрасывает ошибку при рассогласовании алгоритмов по значению палиндрома", () => {
    expect(() =>
      analyzeString("abba", {
        referenceAnalyzer: () => ({
          longestPalindrome: { value: "bb", length: 4 },
          palindromeCount: 6
        })
      })
    ).to.throw("Результаты алгоритмов не совпадают");
  });

  test("выбрасывает ошибку при рассогласовании алгоритмов по длине палиндрома", () => {
    expect(() =>
      analyzeString("abba", {
        referenceAnalyzer: () => ({
          longestPalindrome: { value: "abba", length: 3 },
          palindromeCount: 6
        })
      })
    ).to.throw("Результаты алгоритмов не совпадают");
  });

  test("выбрасывает ошибку при рассогласовании алгоритмов по числу палиндромов", () => {
    expect(() =>
      analyzeString("abba", {
        referenceAnalyzer: () => ({
          longestPalindrome: { value: "abba", length: 4 },
          palindromeCount: 5
        })
      })
    ).to.throw("Результаты алгоритмов не совпадают");
  });
});
