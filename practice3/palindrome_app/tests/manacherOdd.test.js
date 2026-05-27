const { manacherOdd, validateInput } = require("../src/analyzers/manacherOdd");
const {
  bruteForceOddRadii,
  generateStrings
} = require("./helpers/palindromeOracle");

describe("manacherOdd", () => {
  test.each([
    ["a", [1]],
    ["abc", [1, 1, 1]],
    ["abacaba", [1, 2, 1, 4, 1, 2, 1]],
    ["aaaaa", [1, 2, 3, 2, 1]]
  ])("корректно вычисляет нечетные радиусы для %s", (input, expected) => {
    expect(manacherOdd(input)).toEqual(expected);
  });

  test("выбрасывает ошибку для пустой строки", () => {
    expect(() => manacherOdd("")).toThrow("Входная строка должна быть непустой");
  });

  test("выбрасывает ошибку для нестрокового ввода", () => {
    expect(() => validateInput(null)).toThrow("Входная строка должна быть непустой");
  });

  test("совпадает с независимым oracle для полного набора коротких строк", () => {
    for (const input of generateStrings(7)) {
      expect(manacherOdd(input)).toEqual(bruteForceOddRadii(input));
    }
  });
});
