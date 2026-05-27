const { expect } = require("chai");
const {
  centerExpansion,
  expandAroundCenter
} = require("../src/analyzers/centerExpansion");
const {
  bruteForceLongestPalindrome,
  generateStrings
} = require("./helpers/palindromeOracle");

describe("centerExpansion", () => {
  test("корректно расширяет палиндром вокруг нечетного центра", () => {
    const expanded = expandAroundCenter("abacaba", 3, 3);

    expect(expanded).to.deep.equal({
      start: 0,
      end: 6,
      length: 7
    });
  });

  test("корректно расширяет палиндром вокруг четного центра", () => {
    const expanded = expandAroundCenter("abba", 1, 2);

    expect(expanded).to.deep.equal({
      start: 0,
      end: 3,
      length: 4
    });
  });

  test("находит наибольший палиндром для нечетной строки", () => {
    expect(centerExpansion("abacaba")).to.deep.equal({
      start: 0,
      end: 6,
      length: 7,
      value: "abacaba"
    });
  });

  test("находит наибольший палиндром для четной строки", () => {
    expect(centerExpansion("abba")).to.deep.equal({
      start: 0,
      end: 3,
      length: 4,
      value: "abba"
    });
  });

  test("выбрасывает ошибку для пустой строки", () => {
    expect(() => centerExpansion("")).to.throw("Входная строка должна быть непустой");
  });

  test("возвращает именно наибольшую подстроку, а не всю строку", () => {
    expect(centerExpansion("cabbaq")).to.deep.equal({
      start: 1,
      end: 4,
      length: 4,
      value: "abba"
    });
  });

  test("совпадает с независимым oracle на полном наборе коротких строк", () => {
    for (const input of generateStrings(6)) {
      expect(centerExpansion(input)).to.deep.equal(bruteForceLongestPalindrome(input));
    }
  });
});
