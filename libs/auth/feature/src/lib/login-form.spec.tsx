import { setupServer } from 'msw/node';

import {
  ARIA_SUBMIT_LOGIN,
  ERR_LOGIN_FAILED,
  ERR_LOGIN_INCORRECT,
  loginInputs,
  MSG_LOGIN_OK,
  MSG_LOGIN_OK_INFO,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_PRINCIPAL,
  TESTID_LOGIN_LOADING,
  TESTID_SIGNUP_LINK,
  TEXT_LOGIN_FOOTER,
} from '@lihim/auth/core';
import {
  fakeSession,
  mockLoginResponse,
  mockSessionResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL, ERR_INVALID_REQUEST } from '@lihim/shared/core';
import { render, screen, user, waitFor } from '@lihim/shared/testutils/feature';
import { checkInputDefaults } from '@lihim/shared/testutils/ui';

import { LoginForm } from './login-form';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

const fillSignin = async (principal?: string, password?: string) => {
  // Components
  const principalInput = await screen.findByPlaceholderText(
    PLACEHOLDER_PRINCIPAL,
  );
  const passwordInput = await screen.findByPlaceholderText(
    PLACEHOLDER_PASSWORD,
  );

  // Type invalid payload
  await user.type(principalInput, principal || 'demo');
  await user.type(passwordInput, password || '123456');
  await user.keyboard('{Enter}');
};

describe('LoginForm', () => {
  test('defaults', async () => {
    // Mock anon session
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render feature component
    render(<LoginForm />);

    // Locate elements
    const principalInput = screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);
    const submitBtn = screen.getByRole('button', { name: ARIA_SUBMIT_LOGIN });
    const signupLink = screen.getByTestId(TESTID_SIGNUP_LINK);

    // Assert input defaults
    await checkInputDefaults(principalInput, loginInputs[0]);
    await checkInputDefaults(passwordInput, {
      ...loginInputs[1],
      type: 'password',
    });
    expect(submitBtn).toBeVisible();
    expect(signupLink).toBeVisible();
    expect(screen.getByText(TEXT_LOGIN_FOOTER)).toBeVisible();

    // Click signupLink
    await user.click(signupLink);
  });

  test('loading', async () => {
    // Mock long running request
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      mockLoginResponse({
        delay: 50_000,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    );
    // Render feature component
    render(<LoginForm />);

    // Fill form
    await fillSignin();

    // Wait for loading to appear
    await screen.findByTestId(TESTID_LOGIN_LOADING);
  });

  test('validation error', async () => {
    // Mock long running request
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      mockLoginResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INVALID_REQUEST },
      }),
    );
    // Render feature component
    render(<LoginForm />);

    // Fill form
    await fillSignin('demo!', '12345');

    // Loading should not appear
    expect(screen.queryByTestId(TESTID_LOGIN_LOADING)).not.toBeInTheDocument();

    // Assert notification
    await screen.findByText(ERR_LOGIN_FAILED);
    expect(screen.getByText(ERR_LOGIN_INCORRECT)).toBeInTheDocument();

    // Assert red borders
    await waitFor(() => {
      expect(screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL)).toBeInvalid();
    });
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).toBeInvalid();
  });

  test('api error', async () => {
    // Mock long running request
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      mockLoginResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INVALID_REQUEST },
      }),
    );
    // Render feature component
    render(<LoginForm />);

    // Fill form
    await fillSignin();

    // Wait for loading to appear
    await screen.findByTestId(TESTID_LOGIN_LOADING);

    // Assert notification
    await screen.findByText(ERR_LOGIN_FAILED);
    expect(screen.getByText(ERR_LOGIN_INCORRECT)).toBeInTheDocument();

    // Assert red borders
    await waitFor(() => {
      expect(screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL)).toBeInvalid();
    });
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).toBeInvalid();
  });

  test('internal error', async () => {
    // Mock long running request
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      mockLoginResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );
    // Render feature component
    render(<LoginForm />);

    // Fill form
    await fillSignin();

    // Wait for loading to appear
    await screen.findByTestId(TESTID_LOGIN_LOADING);

    // Assert notification
    await screen.findByText(ERR_LOGIN_FAILED);
    expect(screen.getByText(ERR_INTERNAL)).toBeInTheDocument();

    // Assert no red borders
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL),
      ).not.toBeInvalid();
    });
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).not.toBeInvalid();
  });

  test('success', async () => {
    // Mock long running request
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      mockLoginResponse({
        delay: 300,
        status: 200,
        body: { message: MSG_LOGIN_OK_INFO, session: fakeSession() },
      }),
    );

    // Render feature component
    render(<LoginForm />);

    // Fill form
    await fillSignin();

    // Wait for loading to appear
    await screen.findByTestId(TESTID_LOGIN_LOADING);

    // Assert notification
    await screen.findByText(MSG_LOGIN_OK);
    expect(screen.getByText(MSG_LOGIN_OK_INFO)).toBeInTheDocument();

    // Assert no red borders
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL),
      ).not.toBeInvalid();
    });
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).not.toBeInvalid();
  });
});
