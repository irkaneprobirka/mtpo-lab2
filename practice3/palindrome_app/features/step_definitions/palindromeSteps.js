const assert = require("assert");
const fs = require("fs");
const { Given, When, Then } = require("@cucumber/cucumber");
const { analyzeString } = require("../../src/services/palindromeService");
const { centerExpansion } = require("../../src/analyzers/centerExpansion");
const { loadInputFromJson } = require("../../src/io/jsonReader");
const { writeResultToFile, formatResultLines } = require("../../src/io/resultWriter");
const { generateDataset } = require("../../scripts/stringDataset");
const { measureAlgorithms } = require("../../scripts/performanceCore");

Given("приложение анализа палиндромов инициализировано", function () {
  this.reset();
});

Given("пользователь ввел строку {string}", function (input) {
  this.input = input;
});

When("пользователь анализирует строку {string} алгоритмом Манакера", function (input) {
  this.input = input;
  this.result = analyzeString(input);
  this.reference = centerExpansion(input);
});

When("пользователь выбирает пункт {string}", function (command) {
  if (command === "Запустить алгоритм Манакера") {
    this.result = analyzeString(this.input);
    return;
  }

  if (command === "Показать подробный отчет") {
    this.report = formatResultLines(this.result).join("\n");
    return;
  }

  throw new Error(`Неизвестная команда: ${command}`);
});

Then("самый длинный палиндром равен {string}", function (expected) {
  assert.strictEqual(this.result.longestPalindrome.value, expected);
});

Then("количество палиндромных подстрок равно {int}", function (expected) {
  assert.strictEqual(this.result.palindromeCount, expected);
});

Then("результат совпадает с эталонным алгоритмом расширения от центра", function () {
  assert.strictEqual(this.reference.value, this.result.longestPalindrome.value);
  assert.strictEqual(this.reference.length, this.result.longestPalindrome.length);
});

Then("отчет содержит строку {string}", function (text) {
  assert.ok(this.report.includes(text));
});

Then("отчет содержит самый длинный палиндром {string}", function (text) {
  assert.ok(this.report.includes(text));
});

Then("отчет не содержит сообщение об ошибке", function () {
  assert.ok(!this.report.toLowerCase().includes("ошибка"));
});

Given("временная рабочая директория доступна", function () {
  assert.ok(fs.existsSync(this.tempDir));
});

Given("JSON-файл {string} содержит:", function (filename, body) {
  fs.writeFileSync(this.filePath(filename), body, "utf8");
});

When("приложение загружает строку из файла {string}", async function (filename) {
  this.input = await loadInputFromJson(this.filePath(filename));
});

When("приложение пытается загрузить строку из файла {string}", async function (filename) {
  try {
    this.input = await loadInputFromJson(this.filePath(filename));
  } catch (error) {
    this.error = error;
  }
});

When("пользователь анализирует загруженную строку алгоритмом Манакера", function () {
  this.result = analyzeString(this.input);
});

Then("результат можно сохранить в файл {string}", function (filename) {
  writeResultToFile(this.result, this.filePath(filename));
  assert.ok(fs.existsSync(this.filePath(filename)));
});

Then("файл {string} содержит поле {string}", function (filename, field) {
  const content = fs.readFileSync(this.filePath(filename), "utf8");
  assert.ok(content.includes(`"${field}"`));
});

Then("возникает ошибка формата входных данных", function () {
  assert.ok(this.error);
});

Then("приложение продолжает работу", function () {
  assert.doesNotThrow(() => analyzeString("aba"));
});

Given("подготовлены генераторы строковых наборов данных", function () {
  assert.strictEqual(typeof generateDataset, "function");
});

Given("сгенерирован набор данных {string} типа {string} длины {int}", function (name, type, length) {
  this.datasetName = name;
  this.input = generateDataset(type, length);
  assert.strictEqual(this.input.length, length);
});

When("выполняется сравнение алгоритма Манакера и расширения от центра", function () {
  this.measurements = measureAlgorithms(this.input);
});

Then("оба алгоритма находят один и тот же самый длинный палиндром", function () {
  assert.strictEqual(this.measurements.manacher.longest, this.measurements.center.longest);
});

Then("время алгоритма Манакера не превышает {int} мс", function (limitMs) {
  assert.ok(this.measurements.manacher.ms <= limitMs);
});

Then("время эталонного алгоритма фиксируется в отчете эксперимента", function () {
  assert.ok(Number.isFinite(this.measurements.center.ms));
});
