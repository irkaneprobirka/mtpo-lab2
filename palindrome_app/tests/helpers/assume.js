const fs = require("fs");

class AssumptionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssumptionError";
  }
}

function assumeTrue(condition, message) {
  if (!condition) {
    throw new AssumptionError(message || "Предусловие теста не выполнено");
  }
}

function assumeFileExists(path) {
  assumeTrue(fs.existsSync(path), `Ожидаемый файл не найден: ${path}`);
}

async function withAssumptions(callback) {
  try {
    await callback();
  } catch (error) {
    if (error instanceof AssumptionError) {
      return;
    }

    throw error;
  }
}

module.exports = {
  AssumptionError,
  assumeTrue,
  assumeFileExists,
  withAssumptions
};
