const fs = require("fs");
const path = require("path");
const { generateDataset } = require("./stringDataset");

const DATASETS = [
  ["ALT_1000_A", "alternate", 1000],
  ["ALT_5000_A", "alternate", 5000],
  ["MIR_2000_A", "mirror", 2000],
  ["MIR_10000_A", "mirror", 10000],
  ["UNI_4000_A", "uniform", 4000],
  ["UNI_16000_A", "uniform", 16000],
  ["RND_10000_A", "random-like", 10000]
];

function main() {
  const outputDir = path.join(__dirname, "..", "datasets");
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [name, type, length] of DATASETS) {
    const payload = {
      name,
      type,
      length,
      input: generateDataset(type, length)
    };
    fs.writeFileSync(path.join(outputDir, `${name}.json`), JSON.stringify(payload), "utf8");
  }

  console.log(`Generated ${DATASETS.length} datasets in ${outputDir}`);
}

if (require.main === module) {
  main();
}

module.exports = { DATASETS };
