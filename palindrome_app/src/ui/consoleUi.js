const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const { analyzeString, analyzeWithCenterExpansion } = require("../services/palindromeService");
const { loadInputFromJson } = require("../io/jsonReader");
const { printResult, writeResultToFile } = require("../io/resultWriter");

class ConsoleUi {
  constructor(options = {}) {
    this.reader =
      options.reader ||
      readline.createInterface({
        input,
        output
      });
    this.loader = options.loader || loadInputFromJson;
    this.analyzer = options.analyzer || analyzeString;
    this.referenceAnalyzer = options.referenceAnalyzer || analyzeWithCenterExpansion;
    this.resultPrinter = options.resultPrinter || printResult;
    this.resultWriter = options.resultWriter || writeResultToFile;
    this.logger = options.logger || console.log;
    this.currentInput = null;
    this.lastResult = null;
  }

  async run() {
    while (true) {
      this.printMenu();
      const command = (await this.reader.question("Выбор: ")).trim();

      if (command === "0") {
        await this.reader.close();
        return;
      }

      try {
        await this.handleCommand(command);
      } catch (error) {
        this.logger(`Ошибка: ${error.message}`);
      }
    }
  }

  async handleCommand(command) {
    if (command === "1") {
      this.currentInput = await this.reader.question("Введите строку: ");
      this.lastResult = null;
      return;
    }

    if (command === "2") {
      const path = await this.reader.question("Путь к JSON-файлу: ");
      this.currentInput = await this.loader(path.trim());
      this.lastResult = null;
      return;
    }

    if (command === "3") {
      this.ensureInput();
      this.lastResult = this.analyzer(this.currentInput);
      this.resultPrinter(this.lastResult, this.logger);
      return;
    }

    if (command === "4") {
      this.ensureInput();
      this.lastResult = this.referenceAnalyzer(this.currentInput);
      this.resultPrinter(this.lastResult, this.logger);
      return;
    }

    if (command === "5") {
      this.ensureResult();
      this.resultPrinter(this.lastResult, this.logger);
      return;
    }

    if (command === "6") {
      this.ensureResult();
      const path = await this.reader.question("Файл результата: ");
      this.resultWriter(this.lastResult, path.trim());
      this.logger("Результат сохранен.");
      return;
    }

    if (command === "7") {
      this.printHelp();
      return;
    }

    this.logger("Неизвестная команда.");
  }

  printMenu() {
    this.logger("\n==== Анализ палиндромных подстрок ====");
    this.logger(
      this.currentInput
        ? `Строка длины ${this.currentInput.length}`
        : "Строка не задана"
    );
    this.logger("1. Ввести строку вручную");
    this.logger("2. Загрузить строку из JSON");
    this.logger("3. Запустить алгоритм Манакера");
    this.logger("4. Запустить расширение от центра");
    this.logger("5. Показать подробный отчет");
    this.logger("6. Сохранить результат в JSON-файл");
    this.logger("7. Справка");
    this.logger("0. Выход");
  }

  printHelp() {
    this.logger('Формат входного файла: { "input": "abacaba" }');
    this.logger(
      "Пункт 3 запускает Манакера, пункт 4 - эталонное расширение от центра."
    );
    this.logger(
      "Результат включает oddRadii, evenRadii, longestPalindrome, palindromeCount и recommendation."
    );
  }

  ensureInput() {
    if (!this.currentInput || this.currentInput.length === 0) {
      throw new Error("Сначала необходимо задать строку");
    }
  }

  ensureResult() {
    if (!this.lastResult) {
      throw new Error("Сначала необходимо выполнить анализ");
    }
  }
}

module.exports = { ConsoleUi };
