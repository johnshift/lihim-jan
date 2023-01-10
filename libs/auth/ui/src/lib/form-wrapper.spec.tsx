import { render, screen } from '@lihim/shared/testutils/ui';

import { FormWrapper } from './form-wrapper';

describe('FormWrapper', () => {
  // Constants
  const childTestId = 'child-testid';
  const loadingTestId = 'loading-testid';

  test('defaults', () => {
    // Render component
    render(
      <FormWrapper
        isLoading={false}
        loadingTestId={loadingTestId}
        onSubmit={jest.fn()}
      >
        <div data-testid={childTestId} />
      </FormWrapper>,
    );

    // Assertions
    expect(screen.getByTestId(childTestId)).toBeVisible();
    expect(screen.queryByTestId(loadingTestId)).not.toBeInTheDocument();
  });

  test('loading', () => {
    // Render component
    render(
      <FormWrapper isLoading loadingTestId={loadingTestId} onSubmit={jest.fn()}>
        <div data-testid={childTestId} />
      </FormWrapper>,
    );

    // Assertions
    expect(screen.getByTestId(loadingTestId)).toBeVisible();
  });
});
