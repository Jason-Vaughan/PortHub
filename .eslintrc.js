module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Basic rules for PortHub
    'no-unused-vars': 'warn',
    'no-console': 'off', // We want console output in CLI
    'no-undef': 'off', // TypeScript handles this
  },
};
