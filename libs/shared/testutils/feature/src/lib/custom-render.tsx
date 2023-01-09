import { ReactElement } from 'react';

import { render, RenderOptions } from '@testing-library/react';

import { TestWrapper } from './test-wrapper';

// Render function for react-query test wrapper
export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestWrapper, ...options });
