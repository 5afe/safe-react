// @flow
const esModules = ['immortal-db'].join('|')

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
    '#(.*)$': '<rootDir>/safe-contracts/build/contracts/$1',
    '^react-native$': 'react-native-web',
  },
  setupFiles: [
    '<rootDir>/config/webpack.config.test.js',
    '<rootDir>/config/polyfills.js',
    '<rootDir>/config/jest/LocalStorageMock.js',
    '<rootDir>/config/jest/Web3Mock.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.js', '@testing-library/react/cleanup-after-each'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.js?(x)', '<rootDir>/src/**/?(*.)(spec|test).js?(x)'],
  testURL: 'http://localhost:8000',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|scss)$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  verbose: true,
}
