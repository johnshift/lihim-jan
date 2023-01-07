export default {
  displayName: 'shared-data-access',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/data-access',
  collectCoverageFrom: ['<rootDir>/src/lib/**/*.{js,jsx,ts,tsx}'],
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
