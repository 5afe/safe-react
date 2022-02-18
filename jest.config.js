// jest.config.js
module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.{.test.*}",
    "!src/**/test/**/*",
    "!src/**/assets/**"
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle module aliases
    '^src/(.*)$': '<rootDir>/src/$1'
  },

  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Handle CSS imports (without CSS modules)
    '\\.(css|sass|scss)$': '<rootDir>/config/jest/cssTransform.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '\\.(png|jpg|svg)$/i': '<rootDir>/config/jest/fileTransform.js',

    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
