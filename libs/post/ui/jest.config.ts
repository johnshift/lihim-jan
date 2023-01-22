export default {
  displayName: 'post-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/post/ui',
  // Temporary disable coverage requirements until lib is stable
  // collectCoverageFrom: ['<rootDir>/src/lib/**/*.{js,jsx,ts,tsx}'],
  // coverageReporters: ['json', 'lcov', 'html'],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //     watermark: {
  //       branches: [90, 100],
  //       functions: [90, 100],
  //       lines: [90, 100],
  //       statements: [90, 100],
  //     },
  //   },
  // },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
