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
    const { session, isLoading, authModalState, setAuthModalState } =
      result.current;

    // Assert default values
    expect(session).toStrictEqual({ isAnon: true });
    expect(isLoading).toBe(false);
    expect(authModalState).toBe(AuthModalState.Closed);
    expect(setAuthModalState).toBeDefined();
    expect(setAuthModalState(AuthModalState.Closed)).toBeNull();
  });

  test('auth modal controls', async () => {
    // Mock session response
    const mockSession = fakeSession();
    mswServer.use(mockSessionResponse(200, mockSession));

    // Arrange
    const testIdModalState = 'auth-modal-state';
    const testIdCloseModal = 'close-modal';
    const testIdShowSignin = 'show-signin';
    const testIdShowSignup = 'show-signup';

    // Test component
    const TestComponent = () => {
      const { authModalState, setAuthModalState } = useRootContext();

      return (
        <>
          <p data-testid={testIdModalState}>{authModalState}</p>
          <button
            data-testid={testIdCloseModal}
            type="button"
            onClick={() => setAuthModalState(AuthModalState.Closed)}
          >
            close modal
          </button>
          <button
            data-testid={testIdShowSignin}
            type="button"
            onClick={() => setAuthModalState(AuthModalState.Login)}
          >
            show signin
          </button>
          <button
            data-testid={testIdShowSignup}
            type="button"
            onClick={() => setAuthModalState(AuthModalState.Signup)}
          >
            show signup
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

    // Assert show signin
    await user.click(screen.getByTestId(testIdShowSignin));
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

    // Assert close modal
    await user.click(screen.getByTestId(testIdCloseModal));
    await waitFor(() => {
      expect(screen.getByTestId(testIdModalState)).toHaveTextContent(
        AuthModalState.Closed.toString(),
      );
    });
  });
});
