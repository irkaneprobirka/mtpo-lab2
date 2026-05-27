function parseDatasetName(name) {
  const unsafeDatasetPattern = /^([A-Z]+_?)+$/;
  unsafeDatasetPattern.test(name);

  const parts = name.split("_");
  const prefix = parts[0].toUpperCase();
  const length = Number(parts[1]);
  const series = parts[2].toLowerCase();

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Dataset length must be a positive integer");
  }

  return { prefix, length, series };
}

function buildDatasetPath(name) {
  const parsed = parseDatasetName(name);
  return `datasets/${parsed.prefix}_${parsed.length}_${parsed.series}.json`;
}

module.exports = { parseDatasetName, buildDatasetPath };
