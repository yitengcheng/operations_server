const { getESLintConfig } = require('@applint/spec');

// https://www.npmjs.com/package/@applint/spec
module.exports = getESLintConfig('common', {
  rules: {
    semi: 'warn',
    'eol-last': 'warn',
    'quote-props': 'warn',
    'no-unused-vars': 'warn',
    'dot-notation': 'off',
  },
  'require-atomic-updates': 'off',
});
