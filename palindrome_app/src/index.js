const { ConsoleUi } = require("./ui/consoleUi");

async function main() {
  const ui = new ConsoleUi();
  await ui.run();
}

main().catch((error) => {
  console.error("Ошибка запуска приложения:", error.message);
  process.exit(1);
});
