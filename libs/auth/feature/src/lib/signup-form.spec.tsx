import * as nextRouter from 'next/router';

import { setupServer } from 'msw/node';

import type { SignupPayload } from '@lihim/auth/core';
import { credentialInputs, nameInputs } from '@lihim/auth/core';
import {
  ARIA_SUBMIT_SIGNUP,
  ERR_SIGNUP_FAILED,
  MSG_SIGNUP_OK,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_FIRSTNAME,
  PLACEHOLDER_LASTNAME,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_USERNAME,
  TESTID_LOGIN_LINK,
  TESTID_SIGNUP_LOADING,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import {
  fakeSession,
  fakeSignupPayload,
  mockSessionResponse,
  mockSignupResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL } from '@lihim/shared/core';
import { render, screen, user, waitFor } from '@lihim/shared/testutils/feature';
import { checkInputDefaults } from '@lihim/shared/testutils/ui';

import { SignupForm } from './signup-form';

const locateElements = () => {
  // Locate elements
  const firstnameInput = screen.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
  const lastnameInput = screen.getByPlaceholderText(PLACEHOLDER_LASTNAME);
  const usernameInput = screen.getByPlaceholderText(PLACEHOLDER_USERNAME);
  const emailInput = screen.getByPlaceholderText(PLACEHOLDER_EMAIL);
  const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);
  const submitBtn = screen.getByRole('button', {
    name: ARIA_SUBMIT_SIGNUP,
  });
  const loginLink = screen.getByTestId(TESTID_LOGIN_LINK);

  return {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
    submitBtn,
    loginLink,
  };
};

const fillupForm = async (_payload?: Partial<SignupPayload>) => {
  // Valid payload with override
  const payload: SignupPayload = {
    ...fakeSignupPayload(),
    ..._payload,
  };

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
    submitBtn,
  } = locateElements();

  // Fillup form
  await user.type(firstnameInput, payload.firstname);
  await user.type(lastnameInput, payload.lastname);
  await user.type(usernameInput, payload.username);
  await user.type(emailInput, payload.email);
  await user.type(passwordInput, payload.password);
  await user.click(submitBtn);
};

// Mock next router
jest.mock('next/router', () => ({
  __esModule: true,
  ...jest.requireActual('next/router'),
}));

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

describe('SignupForm', () => {
  const API_ERROR = 'Test api error';

  test('defaults', async () => {
    // Mock anon session
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
      submitBtn,
      loginLink,
    } = locateElements();

    // Assertions
    await checkInputDefaults(firstnameInput, nameInputs[0]);
    await checkInputDefaults(lastnameInput, nameInputs[1]);
    await checkInputDefaults(usernameInput, credentialInputs[0]);
    await checkInputDefaults(emailInput, credentialInputs[1]);
    await checkInputDefaults(passwordInput, {
      ...credentialInputs[2],
      type: 'password',
    });
    expect(submitBtn).toBeVisible();
    expect(loginLink).toBeVisible();
    expect(screen.getByText(TEXT_SIGNUP_FOOTER)).toBeVisible();

    // Click signupLink
    await user.click(loginLink);
  });

  test('loading', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockSignupResponse({
        delay: 50_000,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Wait for loading to appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);
  });

  test('firstname validation', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm({ firstname: 'John!' });

    // Assert instant (no loading)
    expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(firstnameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });

  test('lastname validation', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm({ lastname: 'Smith!' });

    // Assert instant (no loading)
    expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(lastnameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });

  test('username validation', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm({ username: 'demo!' });

    // Assert instant (no loading)
    expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(usernameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });

  test('email validation', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm({ email: 'x@i.o' });

    // Assert instant (no loading)
    expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(emailInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });

  test('password validation', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm({ password: '12345' });

    // Assert instant (no loading)
    expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(passwordInput.parentElement).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
  });

  test('firstname api error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { field: 'firstname', message: API_ERROR },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(firstnameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();

    // Assert notification
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    expect(screen.getByText(API_ERROR)).toBeInTheDocument();
  });

  test('lastname api error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { field: 'lastname', message: API_ERROR },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(lastnameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();

    // Assert notification
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    expect(screen.getByText(API_ERROR)).toBeInTheDocument();
  });

  test('username api error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { field: 'username', message: API_ERROR },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(usernameInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();

    // Assert notification
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    expect(screen.getAllByText(API_ERROR).length).toBe(2);
  });

  test('email api error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { field: 'email', message: API_ERROR },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(emailInput).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();

    // Assert notification
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    expect(screen.getAllByText(API_ERROR).length).toBe(2);
  });

  test('password api error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { field: 'password', message: API_ERROR },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert invalid firstname field
    await waitFor(() => {
      expect(passwordInput.parentElement).toBeInvalid();
    });

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();

    // Assert notification
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    expect(screen.getAllByText(API_ERROR).length).toBe(2);
  });

  test('internal error', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Assert notification
    await waitFor(() => {
      expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
    });
    expect(screen.getByText(ERR_INTERNAL)).toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });

  test('success', async () => {
    // Mock anon session
    mswServer.use(
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 100,
        status: 200,
        body: { message: 'Welcome test-user!', session: fakeSession() },
      }),
    );

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Render component
    render(<SignupForm />);

    // Fillup form
    await fillupForm();

    // Loading should appear
    await screen.findByTestId(TESTID_SIGNUP_LOADING);

    // Assert notification
    await waitFor(() => {
      expect(screen.getByText(MSG_SIGNUP_OK)).toBeInTheDocument();
    });
    expect(screen.getByText('Welcome test-user!')).toBeInTheDocument();

    // Locate elements
    const {
      firstnameInput,
      lastnameInput,
      usernameInput,
      emailInput,
      passwordInput,
    } = locateElements();

    // Assert all other inputs not to be invalid
    expect(firstnameInput).not.toBeInvalid();
    expect(lastnameInput).not.toBeInvalid();
    expect(usernameInput).not.toBeInvalid();
    expect(emailInput).not.toBeInvalid();
    expect(passwordInput.parentElement).not.toBeInvalid();
  });
});
