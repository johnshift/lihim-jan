import {
  TESTID_LOGOUT_LOADING,
  TEXT_LOGOUT,
  TEXT_LOGOUT_SUBTITLE,
  TEXT_LOGOUT_TITLE,
} from '@lihim/auth/core';
import { TEXT_CANCEL } from '@lihim/shared/core';
import { render, screen, user, waitFor } from '@lihim/shared/testutils/ui';

import { LogoutForm } from './logout-form';

describe('LogoutForm', () => {
  test('visibility', () => {
    // Render component
    render(
      <LogoutForm
        isLoading={false}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    // Assert visibility
    expect(screen.getByText(TEXT_LOGOUT_TITLE)).toBeVisible();
    expect(screen.getByText(TEXT_LOGOUT_SUBTITLE)).toBeVisible();
    expect(screen.queryByTestId(TESTID_LOGOUT_LOADING)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: TEXT_CANCEL })).toBeVisible();
    expect(screen.getByRole('button', { name: TEXT_LOGOUT })).toBeVisible();
  });

  test('isLoading', () => {
    // Render component
    render(<LogoutForm isLoading onCancel={jest.fn()} onSubmit={jest.fn()} />);

    // Assert loading
    expect(screen.getByTestId(TESTID_LOGOUT_LOADING)).toBeVisible();
  });

  test('onCancel', async () => {
    // Setup
    const onCancel = jest.fn();

    // Render component
    render(
      <LogoutForm isLoading={false} onCancel={onCancel} onSubmit={jest.fn()} />,
    );

    // Click buttons
    await user.click(screen.getByRole('button', { name: TEXT_CANCEL }));

    // Assert onClick actions called
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  test('onSubmit', async () => {
    // Setup
    const onSubmit = jest.fn();

    // Render component
    render(
      <LogoutForm isLoading={false} onCancel={jest.fn()} onSubmit={onSubmit} />,
    );

    // Click buttons
    await user.click(screen.getByRole('button', { name: TEXT_LOGOUT }));

    // Assert onClick actions called
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
