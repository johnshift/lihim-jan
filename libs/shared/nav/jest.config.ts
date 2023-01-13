export default {
  displayName: 'shared-nav',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/nav',
  collectCoverageFrom: [
    '<rootDir>/src/lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['json', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
      watermark: {
        branches: [80, 95],
        functions: [80, 95],
        lines: [80, 95],
        statements: [80, 95],
      },
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
