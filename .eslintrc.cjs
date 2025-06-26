/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  settings: {
    jest: { version: 29 },
  },
  globals: {
    shopify: "readonly"
  },
  rules: {
    'import/no-duplicates': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
