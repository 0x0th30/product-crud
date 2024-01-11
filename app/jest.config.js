/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  automock: false,
  forceExit: true,
  cacheDirectory: '/tmp/jest_rs',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>' },
  ),
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageProvider: 'babel',
  coverageReporters: [
    'json', 'html',
  ],
  maxWorkers: 1,
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/mocks/',
    '/src/',
  ],
};