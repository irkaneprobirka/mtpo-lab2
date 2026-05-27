const { setWorldConstructor } = require("@cucumber/cucumber");
const fs = require("fs");
const os = require("os");
const path = require("path");

class PalindromeWorld {
  constructor() {
    this.reset();
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "palindrome-bdd-"));
  }

  reset() {
    this.input = null;
    this.result = null;
    this.reference = null;
    this.error = null;
    this.report = "";
    this.measurements = null;
  }

  filePath(filename) {
    return path.join(this.tempDir, filename);
  }
}

setWorldConstructor(PalindromeWorld);
