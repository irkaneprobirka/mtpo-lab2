const fs = require("fs");
const path = require("path");
const { DATASETS } = require("./generateDatasets");
const { generateDataset } = require("./stringDataset");
const { measureAlgorithms } = require("./performanceCore");

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function main() {
  const reportsDir = path.join(__dirname, "..", "reports", "performance");
  fs.mkdirSync(reportsDir, { recursive: true });

  const rows = DATASETS.map(([name, type, length]) => {
    const input = generateDataset(type, length);
    const measurement = measureAlgorithms(input);
    return {
      dataset: name,
      type,
      length,
      manacherMs: round(measurement.manacher.ms),
      centerMs: round(measurement.center.ms),
      speedup: round(measurement.center.ms / Math.max(measurement.manacher.ms, 0.001)),
      memoryMb: round(measurement.memoryMb),
      sameResult: measurement.manacher.longest === measurement.center.longest
    };
  });

  const csv = [
    "dataset,type,length,manacherMs,centerMs,speedup,memoryMb,sameResult",
    ...rows.map((row) => [
      row.dataset,
      row.type,
      row.length,
      row.manacherMs,
      row.centerMs,
      row.speedup,
      row.memoryMb,
      row.sameResult
    ].join(","))
  ].join("\n");

  fs.writeFileSync(path.join(reportsDir, "performance-results.json"), JSON.stringify(rows, null, 2), "utf8");
  fs.writeFileSync(path.join(reportsDir, "performance-results.csv"), csv, "utf8");
  console.table(rows);
}

if (require.main === module) {
  main();
}
