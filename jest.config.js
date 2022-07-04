/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  'preset': 'ts-jest',
  'testEnvironment': 'node',
  'testPathIgnorePatterns': ['frontend', 'dist'],
  'setupFilesAfterEnv': ['./jest.setup.js'],
};
