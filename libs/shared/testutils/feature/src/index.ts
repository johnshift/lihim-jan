import userEvent from '@testing-library/user-event';

// Re-export react-testing-library
export * from '@testing-library/react';

// Test wrapper + render override
export { customRender as render } from './lib/custom-render';
export { TestWrapper } from './lib/test-wrapper';

// Export User event
export const user = userEvent.setup();
