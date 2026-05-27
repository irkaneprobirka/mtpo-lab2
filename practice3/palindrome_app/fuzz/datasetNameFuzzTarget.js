const { parseDatasetName } = require("../src/vulnerable/datasetNameParser");

module.exports.fuzz = function fuzz(data) {
  parseDatasetName(data.toString("utf8"));
};
