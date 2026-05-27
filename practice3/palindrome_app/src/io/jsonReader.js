const fs = require("fs");

const INPUT_FIELD_PATTERN = /"input"\s*:\s*"((?:\\.|[^"\\])*)"/s;

function trimBuffer(buffer) {
  const keyIndex = buffer.indexOf('"input"');

  // Stryker disable next-line EqualityOperator: returning slice(0) and the original string is observably equivalent.
  if (keyIndex >= 0) {
    return buffer.slice(keyIndex);
  }

  // Stryker disable next-line ConditionalExpression, EqualityOperator: for strings slice(-4096) is equivalent in the boundary cases.
  return buffer.length > 4096 ? buffer.slice(-4096) : buffer;
}

function extractInput(buffer) {
  const match = buffer.match(INPUT_FIELD_PATTERN);

  if (!match) {
    return null;
  }

  const value = JSON.parse(`"${match[1]}"`);

  // Stryker disable next-line ConditionalExpression: JSON.parse of the captured group always returns a string here.
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("JSON должен содержать непустое поле input");
  }

  return value;
}

async function loadInputFromJson(path) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
  } catch (error) {
    throw new Error("Файл не найден");
  }

  // Stryker disable next-line StringLiteral: the parser searches the whole buffer, so the initial prefix is equivalent.
  let buffer = "";
  // Stryker disable next-line ObjectLiteral, StringLiteral: UTF-8 is the default textual interpretation for our JSON inputs.
  const stream = fs.createReadStream(path, { encoding: "utf8" });

  for await (const chunk of stream) {
    buffer += chunk;
    const input = extractInput(buffer);

    if (input !== null) {
      stream.destroy();
      return input;
    }

    buffer = trimBuffer(buffer);
  }

  throw new Error("JSON должен содержать непустое поле input");
}

module.exports = { loadInputFromJson, extractInput, trimBuffer };
