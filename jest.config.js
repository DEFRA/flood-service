module.exports = {
  testEnvironment: 'node',
  restoreMocks: true,
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['**/test/**/*.js'],
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
