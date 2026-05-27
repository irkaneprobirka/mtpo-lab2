const fs = require("fs");

function formatResultLines(result) {
  return [
    `Исходная строка: ${result.input}`,
    `Нечетные радиусы: [${result.oddRadii.join(", ")}]`,
    `Четные радиусы: [${result.evenRadii.join(", ")}]`,
    `Наибольший палиндром: ${result.longestPalindrome.value}`,
    `Длина: ${result.longestPalindrome.length}`,
    `Количество палиндромных подстрок: ${result.palindromeCount}`,
    `Рекомендация: ${result.recommendation}`
  ];
}

function printResult(result, logger = console.log) {
  formatResultLines(result).forEach((line) => logger(line));
}

function writeResultToFile(result, path) {
  fs.writeFileSync(path, JSON.stringify(result, null, 2), "utf8");
}

module.exports = { formatResultLines, printResult, writeResultToFile };
