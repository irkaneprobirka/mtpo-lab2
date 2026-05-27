const js = require("@eslint/js");
const security = require("eslint-plugin-security");
const sonarjs = require("eslint-plugin-sonarjs");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "fuzz/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly"
      }
    },
    plugins: {
      security,
      sonarjs
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-unsafe-regex": "warn",
      "sonarjs/no-duplicated-branches": "warn",
      "sonarjs/slow-regex": "warn",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/no-invariant-returns": "warn",
      "sonarjs/cognitive-complexity": ["warn", 8]
    }
  }
];
