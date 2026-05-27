const fs = require("fs");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");
const sinon = require("sinon");
const { extractInput, loadInputFromJson, trimBuffer } = require("../src/io/jsonReader");

describe("jsonReader", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("корректно читает входную строку из JSON", async () => {
    const file = path.join(os.tmpdir(), "palindrome-input.json");
    fs.writeFileSync(file, JSON.stringify({ input: "level" }), "utf8");

    await expect(loadInputFromJson(file)).resolves.toBe("level");
  });

  test("выбрасывает ошибку при отсутствии поля input", async () => {
    const file = path.join(os.tmpdir(), "palindrome-invalid.json");
    fs.writeFileSync(file, JSON.stringify({ value: "level" }), "utf8");

    await expect(loadInputFromJson(file)).rejects.toThrow(
      "JSON должен содержать непустое поле input"
    );
  });

  test("выбрасывает ошибку, если файл не найден", async () => {
    await expect(loadInputFromJson("missing-file.json")).rejects.toThrow("Файл не найден");
  });

  test("выбрасывает ошибку при пустом поле input", async () => {
    const file = path.join(os.tmpdir(), "palindrome-empty-input.json");
    fs.writeFileSync(file, '{ "input": "" }', "utf8");

    await expect(loadInputFromJson(file)).rejects.toThrow(
      "JSON должен содержать непустое поле input"
    );
  });

  test("использует stub для имитации потоковой загрузки файла", async () => {
    sinon.stub(fs.promises, "access").resolves();
    sinon.stub(fs, "createReadStream").returns(Readable.from(['{ "input": "racecar" }']));

    await expect(loadInputFromJson("virtual.json")).resolves.toBe("racecar");
  });

  test("корректно читает поле input даже при дополнительных полях", async () => {
    const file = path.join(os.tmpdir(), "palindrome-streamed.json");
    fs.writeFileSync(
      file,
      JSON.stringify({
        meta: { author: "student", tag: "practice" },
        input: "abacaba",
        options: { ignoreCase: false }
      }),
      "utf8"
    );

    await expect(loadInputFromJson(file)).resolves.toBe("abacaba");
  });

  test("извлекает поле input с экранированными символами", () => {
    expect(extractInput('{ "input": "aba\\\"caba" }')).toBe('aba"caba');
  });

  test("извлекает поле input при наличии пробелов перед двоеточием", () => {
    expect(extractInput('{ "input"   : "level" }')).toBe("level");
  });

  test("обрезает буфер до позиции ключа input при наличии служебного префикса", () => {
    const trimmed = trimBuffer('service-prefix::{"input":"abba"}');

    expect(trimmed).toBe('"input":"abba"}');
  });

  test("ограничивает размер рабочего буфера до хвоста потока", () => {
    const tail = trimBuffer("x".repeat(5000));

    expect(tail.length).toBe(4096);
  });
});
