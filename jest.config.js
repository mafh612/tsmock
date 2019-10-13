module.exports = {
  rootDir: './',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: true
      }
    }
  },
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['json', 'lcov', 'text'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '.test.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '@routes/(.*)': '<rootDir>/src/routes$1',
    '@specification/(.*)': '<rootDir>/src/specification$1',
    '@doc/(.*)': '<rootDir>/src/doc$1',
    '@util/(.*)': '<rootDir>/src/util$1'
  }
}
