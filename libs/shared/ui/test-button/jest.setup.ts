import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { setGlobalConfig } from '@storybook/testing-react';

import * as globalStorybookConfig from './.storybook/preview'; // Path of your preview.js file

setGlobalConfig(globalStorybookConfig);

// Mock media fix
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
