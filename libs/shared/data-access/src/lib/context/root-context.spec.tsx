import { setupServer } from 'msw/node';

import { AuthModalState } from '@lihim/auth/core';
import { fakeSession, mockSessionResponse } from '@lihim/auth/testutils';
import {
  render,
  renderHook,
  screen,
  user,
  waitFor,
} from '@lihim/shared/testutils/data-access';
import { TestWrapper } from '@lihim/shared/testutils/data-access';

import { useRootContext } from '../hooks/use-root-context';

import { RootProvider } from './root-context';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
beforeEach(() => mswServer.resetHandlers());
afterEach(() => mswServer.resetHandlers());

describe('rootContext', () => {
  test('use-session-context', async () => {
    // Render hook
    const { result } = renderHook(() => useRootContext(), {
      wrapper: TestWrapper,
    });

    // Destructure current values
    const { session, isLoading, authModalState, authModalActions } =
      result.current;

    // Assert default values
    expect(session).toStrictEqual({ isAnon: true });
    expect(isLoading).toBe(false);
    expect(authModalState).toBe(AuthModalState.Closed);
    expect(authModalActions).toBeDefined();
    expect(authModalActions.close()).toBeNull();
    expect(authModalActions.openLogin()).toBeNull();
    expect(authModalActions.openLogout()).toBeNull();
    expect(authModalActions.openSignup()).toBeNull();
  });

  test('auth modal controls', async () => {
    // Mock session response
    const mockSession = fakeSession();
    mswServer.use(mockSessionResponse(200, mockSession));

    // Arrange
    const testIdModalState = 'auth-modal-state';
    const testIdCloseModal = 'close-modal';
    const testIdShowLogin = 'show-login';
    const testIdShowLogout = 'show-logout';
    const testIdShowSignup = 'show-signup';

    // Test component
    const TestComponent = () => {
      const { authModalState, authModalActions } = useRootContext();

      return (
        <>
          <p data-testid={testIdModalState}>{authModalState}</p>
          <button
            data-testid={testIdCloseModal}
            type="button"
            onClick={authModalActions.close}
          >
            close modal
          </button>
          <button
            data-testid={testIdShowLogin}
            type="button"
            onClick={authModalActions.openLogin}
          >
            show login
          </button>
          <button
            data-testid={testIdShowSignup}
            type="button"
            onClick={authModalActions.openSignup}
          >
            show signup
          </button>
          <button
            data-testid={testIdShowLogout}
            type="button"
            onClick={authModalActions.openLogout}
          >
            show logout
          </button>
        </>
      );
    };

    // Render component
    render(
      <RootProvider>
        <TestComponent />
      </RootProvider>,
    );

    // Assert default state
    expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
      AuthModalState.Closed.toString(),
    );

    // Assert show login
    await user.click(screen.getByTestId(testIdShowLogin));
    await waitFor(() => {
      expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
        AuthModalState.Login.toString(),
      );
    });

    // Assert show signup
    await user.click(screen.getByTestId(testIdShowSignup));
    await waitFor(() => {
      expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
        AuthModalState.Signup.toString(),
      );
    });

    // Assert show logout
    await user.click(screen.getByTestId(testIdShowLogout));
    await waitFor(() => {
      expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
        AuthModalState.Logout.toString(),
      );
    });

    // Assert close modal
    await user.click(screen.getByTestId(testIdCloseModal));
    await waitFor(() => {
      expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
        AuthModalState.Closed.toString(),
      );
    });
  });
});
