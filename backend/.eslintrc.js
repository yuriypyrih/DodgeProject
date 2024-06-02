module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    // 'plugin:node/recommended',
    // 'plugin:promise/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  parser: '@typescript-eslint/parser',
  rules: {
    // You can customize individual rules here
    'no-console': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'no-unused-vars': 'warn',
    'space-before-function-paren': ['off'],
    semi: 'off'
  }
};
