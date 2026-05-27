const sinon = require("sinon");
const { expect } = require("chai");
const { ConsoleUi } = require("../src/ui/consoleUi");
const {
  assumeTrue,
  assumeFileExists,
  withAssumptions
} = require("./helpers/assume");

describe("consoleUi", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("печатает меню", () => {
    const logger = sinon.spy();
    const ui = new ConsoleUi({
      reader: { question: async () => "0", close: async () => {} },
      logger
    });

    ui.printMenu();

    expect(logger.calledWithMatch("Анализ палиндромных подстрок")).to.equal(true);
    expect(logger.calledWithMatch("Запустить алгоритм Манакера")).to.equal(true);
    expect(logger.calledWithMatch("Запустить расширение от центра")).to.equal(true);
  });

  test("ensureInput выбрасывает ошибку, если строка не задана", () => {
    const ui = new ConsoleUi({
      reader: { question: async () => "0", close: async () => {} },
      logger: () => {}
    });

    expect(() => ui.ensureInput()).to.throw("Сначала необходимо задать строку");
  });

  test("ensureResult выбрасывает ошибку, если результат не рассчитан", () => {
    const ui = new ConsoleUi({
      reader: { question: async () => "0", close: async () => {} },
      logger: () => {}
    });

    expect(() => ui.ensureResult()).to.throw("Сначала необходимо выполнить анализ");
  });

  test("обрабатывает команду запуска алгоритма Манакера и выхода", async () => {
    const questions = ["3", "0"];
    const logger = sinon.spy();
    const resultPrinter = sinon.spy();
    const analyzer = sinon.stub().returns({ input: "abba" });
    const ui = new ConsoleUi({
      reader: {
        question: async () => questions.shift(),
        close: async () => {}
      },
      analyzer,
      resultPrinter,
      logger
    });
    ui.currentInput = "abba";

    await ui.run();

    expect(analyzer.calledOnceWithExactly("abba")).to.equal(true);
    expect(resultPrinter.calledOnce).to.equal(true);
  });

  test("обрабатывает команду запуска эталонного алгоритма", async () => {
    const questions = ["4", "0"];
    const logger = sinon.spy();
    const resultPrinter = sinon.spy();
    const referenceAnalyzer = sinon.stub().returns({ input: "abba" });
    const ui = new ConsoleUi({
      reader: {
        question: async () => questions.shift(),
        close: async () => {}
      },
      analyzer: sinon.stub(),
      referenceAnalyzer,
      resultPrinter,
      logger
    });
    ui.currentInput = "abba";

    await ui.run();

    expect(referenceAnalyzer.calledOnceWithExactly("abba")).to.equal(true);
    expect(resultPrinter.calledOnce).to.equal(true);
  });

  test("обрабатывает ручной ввод и сбрасывает прошлый результат", async () => {
    const reader = {
      question: async () => "manual palindrome",
      close: async () => {}
    };
    const ui = new ConsoleUi({
      reader,
      logger: () => {}
    });
    ui.lastResult = { stale: true };

    await ui.handleCommand("1");

    expect(ui.currentInput).to.equal("manual palindrome");
    expect(ui.lastResult).to.equal(null);
  });

  test("обрабатывает загрузку из JSON и сбрасывает прошлый результат", async () => {
    const reader = {
      question: async () => "input.json",
      close: async () => {}
    };
    const loader = sinon.stub().resolves("loaded palindrome");
    const ui = new ConsoleUi({
      reader,
      loader,
      logger: () => {}
    });
    ui.lastResult = { stale: true };

    await ui.handleCommand("2");

    expect(loader.calledOnceWithExactly("input.json")).to.equal(true);
    expect(ui.currentInput).to.equal("loaded palindrome");
    expect(ui.lastResult).to.equal(null);
  });

  test("показывает последний результат по отдельной команде", async () => {
    const resultPrinter = sinon.spy();
    const ui = new ConsoleUi({
      reader: { question: async () => "0", close: async () => {} },
      resultPrinter,
      logger: () => {}
    });
    ui.lastResult = { input: "abba" };

    await ui.handleCommand("5");

    expect(resultPrinter.calledOnce).to.equal(true);
  });

  test("показывает справку и сообщает о неизвестной команде", async () => {
    const logger = sinon.spy();
    const ui = new ConsoleUi({
      reader: { question: async () => "0", close: async () => {} },
      logger
    });

    await ui.handleCommand("7");
    await ui.handleCommand("99");

    expect(logger.calledWithMatch('Формат входного файла')).to.equal(true);
    expect(logger.calledWithMatch("Неизвестная команда.")).to.equal(true);
  });

  test("не завершает программу аварийно при ошибке загрузки", async () => {
    const questions = ["2", "broken.json", "0"];
    const logger = sinon.spy();
    const ui = new ConsoleUi({
      reader: {
        question: async () => questions.shift(),
        close: async () => {}
      },
      loader: async () => {
        throw new Error("Файл поврежден");
      },
      logger
    });

    await ui.run();

    expect(logger.calledWithMatch("Ошибка: Файл поврежден")).to.equal(true);
  });

  test("использует два assumption-style метода для проверки окружения", async () => {
    const helperPath = require.resolve("./helpers/assume");

    await withAssumptions(async () => {
      assumeTrue(typeof helperPath === "string" && helperPath.length > 0, "Путь к helper не определен");
      assumeFileExists(helperPath);

      const logger = sinon.spy();
      const ui = new ConsoleUi({
        reader: { question: async () => "0", close: async () => {} },
        logger
      });

      ui.printHelp();

      expect(logger.calledThrice).to.equal(true);
    });
  });

  test("использует mock для контроля записи результата", async () => {
    const reader = {
      question: async () => "report.json",
      close: async () => {}
    };
    const writerHolder = {
      writeResult() {}
    };
    const writerMock = sinon.mock(writerHolder);
    writerMock.expects("writeResult").once().withExactArgs({ input: "abba" }, "report.json");

    const ui = new ConsoleUi({
      reader,
      logger: () => {},
      resultWriter: (...args) => writerHolder.writeResult(...args)
    });
    ui.lastResult = { input: "abba" };

    await ui.handleCommand("6");

    writerMock.verify();
  });
});
