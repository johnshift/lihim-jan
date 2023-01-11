import { useForm } from 'react-hook-form';

import type { LoginPayload } from '@lihim/auth/core';
import {
  ARIA_SUBMIT_LOGIN,
  LABEL_PASSWORD,
  LABEL_PRINCIPAL,
  NAME_PASSWORD,
  NAME_PRINCIPAL,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_PRINCIPAL,
  TESTID_LOGIN_LOADING,
  TESTID_SIGNUP_LINK,
  TEXT_LOGIN_FOOTER,
} from '@lihim/auth/core';
import {
  render,
  renderHook,
  screen,
  user,
  waitFor,
} from '@lihim/shared/testutils/ui';

import { LoginForm } from './login-form';

describe('LoginForm', () => {
  test('defaults', async () => {
    // Setup
    const { result } = renderHook(() => useForm<LoginPayload>());

    // Render
    render(
      <LoginForm
        isLoading={false}
        hasError={false}
        showSignup={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Locate elements
    const principalInput = screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);
    const submitBtn = screen.getByRole('button', {
      name: ARIA_SUBMIT_LOGIN,
    });
    const signupLink = screen.getByTestId(TESTID_SIGNUP_LINK);

    // Assert principal input defaults
    expect(principalInput).toHaveValue('');
    expect(principalInput).toHaveAttribute('type', 'text');
    expect(principalInput).toHaveAttribute('aria-invalid', 'false');
    expect(principalInput).toHaveAttribute('name', NAME_PRINCIPAL);
    expect(principalInput).toHaveAttribute(
      'placeholder',
      PLACEHOLDER_PRINCIPAL,
    );
    expect(screen.getByText(LABEL_PRINCIPAL)).toBeVisible();

    // Assert password input defaults
    expect(passwordInput).toHaveValue('');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput.parentElement).toHaveAttribute(
      'aria-invalid',
      'false',
    );
    expect(passwordInput).toHaveAttribute('name', NAME_PASSWORD);
    expect(passwordInput).toHaveAttribute('placeholder', PLACEHOLDER_PASSWORD);
    expect(screen.getByText(LABEL_PASSWORD)).toBeVisible();

    // Submit button
    expect(submitBtn).toBeVisible();

    // Footer
    expect(screen.getByText(TEXT_LOGIN_FOOTER)).toBeVisible();
    expect(signupLink).toBeVisible();
  });

  test('isLoading', async () => {
    // Setup
    const { result } = renderHook(() => useForm<LoginPayload>());

    // Render
    render(
      <LoginForm
        isLoading
        hasError={false}
        showSignup={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Assertions
    expect(screen.getByTestId(TESTID_LOGIN_LOADING)).toBeVisible();
  });

  test('hasError', async () => {
    // Setup
    const { result } = renderHook(() => useForm<LoginPayload>());

    // Render
    render(
      <LoginForm
        hasError
        isLoading={false}
        showSignup={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Locate elements
    const principalInput = screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);

    // Assertions
    expect(principalInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput.parentElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('onSubmit called', async () => {
    // Setup
    const onSubmit = jest.fn().mockImplementation((e) => e.preventDefault());
    const { result } = renderHook(() => useForm<LoginPayload>());

    // Render
    render(
      <LoginForm
        hasError
        isLoading={false}
        showSignup={jest.fn()}
        control={result.current.control}
        onSubmit={onSubmit}
      />,
    );

    // Locate elements
    const principalInput = screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);
    const submitBtn = screen.getByRole('button', {
      name: ARIA_SUBMIT_LOGIN,
    });

    // Type info (all fields are required)
    await user.type(principalInput, 'demo');
    await user.type(passwordInput, '123456');

    // Click submit button
    await user.click(submitBtn);

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('showSignup called', async () => {
    // Setup
    const showSignup = jest.fn();
    const { result } = renderHook(() => useForm<LoginPayload>());

    // Render
    render(
      <LoginForm
        hasError
        isLoading={false}
        showSignup={showSignup}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Locate element
    const signupLink = screen.getByTestId(TESTID_SIGNUP_LINK);

    // Click signup link
    await user.click(signupLink);

    // Assert
    await waitFor(() => {
      expect(showSignup).toHaveBeenCalledTimes(1);
    });
  });
});
