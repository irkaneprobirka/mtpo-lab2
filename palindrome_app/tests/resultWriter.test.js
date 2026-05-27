const fs = require("fs");
const os = require("os");
const path = require("path");
const sinon = require("sinon");
const { expect } = require("chai");
const {
  formatResultLines,
  printResult,
  writeResultToFile
} = require("../src/io/resultWriter");

describe("resultWriter", () => {
  afterEach(() => {
    sinon.restore();
  });

  const sampleResult = {
    input: "abba",
    oddRadii: [1, 1, 1, 1],
    evenRadii: [0, 0, 2, 0],
    longestPalindrome: { value: "abba", start: 0, end: 3, length: 4 },
    palindromeCount: 6,
    recommendation: "Строка содержит крупный палиндромный фрагмент."
  };

  test("формирует человекочитаемые строки отчета", () => {
    const lines = formatResultLines(sampleResult);

    expect(lines).to.deep.equal([
      "Исходная строка: abba",
      "Нечетные радиусы: [1, 1, 1, 1]",
      "Четные радиусы: [0, 0, 2, 0]",
      "Наибольший палиндром: abba",
      "Длина: 4",
      "Количество палиндромных подстрок: 6",
      "Рекомендация: Строка содержит крупный палиндромный фрагмент."
    ]);
  });

  test("печатает результат в консоль", () => {
    const logger = sinon.spy();
    printResult(sampleResult, logger);

    expect(logger.callCount).to.equal(7);
    expect(logger.calledWithExactly("Исходная строка: abba")).to.equal(true);
    expect(logger.calledWithExactly("Рекомендация: Строка содержит крупный палиндромный фрагмент.")).to.equal(true);
  });

  test("сохраняет результат в JSON-файл через stub", () => {
    const file = path.join(os.tmpdir(), "palindrome-result.json");
    const writeStub = sinon.stub(fs, "writeFileSync");

    writeResultToFile(sampleResult, file);

    expect(writeStub.calledOnce).to.equal(true);
    expect(writeStub.firstCall.args[0]).to.equal(file);
    expect(JSON.parse(writeStub.firstCall.args[1])).to.deep.equal(sampleResult);
    expect(writeStub.firstCall.args[2]).to.equal("utf8");
  });
});
