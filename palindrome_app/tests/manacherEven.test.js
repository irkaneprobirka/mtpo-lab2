const { manacherEven } = require("../src/analyzers/manacherEven");
const {
  bruteForceEvenRadii,
  generateStrings
} = require("./helpers/palindromeOracle");

describe("manacherEven", () => {
  test.each([
    ["a", [0]],
    ["ab", [0, 0]],
    ["aa", [0, 1]],
    ["abba", [0, 0, 2, 0]]
  ])("корректно вычисляет четные радиусы для %s", (input, expected) => {
    expect(manacherEven(input)).toEqual(expected);
  });

  test("выбрасывает ошибку для пустой строки", () => {
    expect(() => manacherEven("")).toThrow("Входная строка должна быть непустой");
  });

  test("совпадает с независимым oracle для полного набора коротких строк", () => {
    for (const input of generateStrings(7)) {
      expect(manacherEven(input)).toEqual(bruteForceEvenRadii(input));
    }
  });
});
