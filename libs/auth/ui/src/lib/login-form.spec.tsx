import { useForm } from 'react-hook-form';

import {
  authAria,
  authInputProps,
  authTestId,
  LoginPayload,
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
    const principalInput = screen.getByPlaceholderText(
      authInputProps.principal.placeholder,
    );
    const passwordInput = screen.getByPlaceholderText(
      authInputProps.password.placeholder,
    );
    const submitBtn = screen.getByRole('button', {
      name: authAria.submitLogin,
    });
    const signupLink = screen.getByTestId(authTestId.loginFooterLink);

    // Assert principal input defaults
    expect(principalInput).toHaveValue('');
    expect(principalInput).toHaveAttribute('type', 'text');
    expect(principalInput).toHaveAttribute('aria-invalid', 'false');
    expect(principalInput).toHaveAttribute(
      'name',
      authInputProps.principal.name,
    );
    expect(principalInput).toHaveAttribute(
      'placeholder',
      authInputProps.principal.placeholder,
    );
    expect(screen.getByText(authInputProps.principal.label)).toBeVisible();

    // Assert password input defaults
    expect(passwordInput).toHaveValue('');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput.parentElement).toHaveAttribute(
      'aria-invalid',
      'false',
    );
    expect(passwordInput).toHaveAttribute('name', authInputProps.password.name);
    expect(passwordInput).toHaveAttribute(
      'placeholder',
      authInputProps.password.placeholder,
    );
    expect(screen.getByText(authInputProps.password.label)).toBeVisible();

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
    expect(screen.getByTestId(authTestId.loginLoadingOverlay)).toBeVisible();
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
    const principalInput = screen.getByPlaceholderText(
      authInputProps.principal.placeholder,
    );
    const passwordInput = screen.getByPlaceholderText(
      authInputProps.password.placeholder,
    );

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
    const principalInput = screen.getByPlaceholderText(
      authInputProps.principal.placeholder,
    );
    const passwordInput = screen.getByPlaceholderText(
      authInputProps.password.placeholder,
    );
    const submitBtn = screen.getByRole('button', {
      name: authAria.submitLogin,
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
    const signupLink = screen.getByTestId(authTestId.loginFooterLink);

    // Click signup link
    await user.click(signupLink);

    // Assert
    await waitFor(() => {
      expect(showSignup).toHaveBeenCalledTimes(1);
    });
  });
});
