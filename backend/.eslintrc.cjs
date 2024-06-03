module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    '../.eslintrc.cjs', // Extend the common configuration
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    // Custom backend rules
    'node/no-unsupported-features/es-syntax': 'off',
    'space-before-function-paren': 'off'
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
};
