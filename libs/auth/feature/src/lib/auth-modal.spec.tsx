import * as nextRouter from 'next/router';

import { setupServer } from 'msw/node';
import { uid } from 'uid';

import {
  PLACEHOLDER_PRINCIPAL,
  TEXT_LOGIN_FOOTER,
  TEXT_LOGOUT_TITLE,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import { fakeSession, mockSessionResponse } from '@lihim/auth/testutils';
import { useRootContext } from '@lihim/shared/data-access';
import { render, screen, user, waitFor } from '@lihim/shared/testutils/feature';

import { AuthModal } from './auth-modal';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

// Mock next router
jest.mock('next/router', () => ({
  __esModule: true,
  ...jest.requireActual('next/router'),
}));

describe('AuthModal', () => {
  // Test vars
  const showTestId = uid();
  const closeTestId = uid();

  test('toggle between login/signup forms', async () => {
    // Mock anon session
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Component that can open the modal
    const TestComponent = () => {
      const { authModalActions } = useRootContext();

      return (
        <>
          <button
            type="button"
            data-testid={showTestId}
            onClick={authModalActions.openLogin}
          >
            Show
          </button>
          <button
            type="button"
            data-testid={closeTestId}
            onClick={authModalActions.close}
          >
            Close
          </button>
          <AuthModal />
        </>
      );
    };

    // Render component
    render(<TestComponent />);

    // Open modal
    await user.click(screen.getByTestId(showTestId));

    // Navigate to signup modal (also asserts login-form was shown)
    await user.click(await screen.findByText(TEXT_LOGIN_FOOTER));

    // Navigate back to login-modal (also asserts signup-form was shown)
    await user.click(await screen.findByText(TEXT_SIGNUP_FOOTER));

    // Close modal
    await user.keyboard('{Escape}');

    // Assert modal closed
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(PLACEHOLDER_PRINCIPAL),
      ).not.toBeInTheDocument();
    });
  });

  test('toggle logout form', async () => {
    // Mock loggedIn session
    mswServer.use(mockSessionResponse(200, fakeSession()));

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Component that can open the modal
    const TestComponent = () => {
      const { authModalActions } = useRootContext();

      return (
        <>
          <button
            type="button"
            data-testid={showTestId}
            onClick={authModalActions.openLogout}
          >
            Show
          </button>
          <button
            type="button"
            data-testid={closeTestId}
            onClick={authModalActions.close}
          >
            Close
          </button>
          <AuthModal />
        </>
      );
    };

    // Render component
    render(<TestComponent />);

    // Open modal
    await user.click(screen.getByTestId(showTestId));

    // Close modal
    await user.keyboard('{Escape}');

    // Assert modal closed
    await waitFor(() => {
      expect(screen.queryByText(TEXT_LOGOUT_TITLE)).not.toBeInTheDocument();
    });
  });
});
