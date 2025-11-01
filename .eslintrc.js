module.exports = {
  env: {
    commonjs: true,
    es2024: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};
