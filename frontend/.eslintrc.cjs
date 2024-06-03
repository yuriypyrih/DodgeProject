module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    '../.eslintrc.cjs', // Extend the common configuration
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-useless-catch': 'warn',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
};
