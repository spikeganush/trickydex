// @ts-check
const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends("expo"),
  {
    ignores: ["dist/*"],
  },
];
