module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(\w+)]\:\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'style', 'refactor', 'test', 'docs', 'chore', 'update'],
    ],
    'type-case': [2, 'always', 'lower-case'], // Ensure type is in lowercase
    'subject-empty': [2, 'never'], // Subject should not be empty
    'header-max-length': [2, 'always', 72], // Limit header length
  },
};
