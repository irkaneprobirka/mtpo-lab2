const { decodePercentInput } = require("../src/vulnerable/percentInputDecoder");

module.exports.fuzz = function fuzz(data) {
  decodePercentInput(data.toString("utf8"));
};
