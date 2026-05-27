const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "..", "reports", "static", "eslint-security.json");
const outputPath = path.join(__dirname, "..", "reports", "static", "static-summary.csv");

function main() {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const rows = [
    "file,line,ruleId,severity,message"
  ];

  for (const fileResult of report) {
    for (const message of fileResult.messages) {
      rows.push([
        path.relative(path.join(__dirname, ".."), fileResult.filePath),
        message.line,
        message.ruleId,
        message.severity,
        JSON.stringify(message.message)
      ].join(","));
    }
  }

  fs.writeFileSync(outputPath, rows.join("\n"), "utf8");
  console.log(`Static summary written to ${outputPath}`);
}

if (require.main === module) {
  main();
}
