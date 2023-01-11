import { useForm } from 'react-hook-form';

import type { SignupPayload } from '@lihim/auth/core';
import {
  ARIA_SUBMIT_SIGNUP,
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
  render,
  renderHook,
  screen,
  user,
  waitFor,
} from '@lihim/shared/testutils/ui';

import { credentialInputs, nameInputs } from './constants';
import { SignupForm } from './signup-form';

type CheckOptions = {
  name: string;
  placeholder: string;
  label: string;
  value?: string;
  invalid?: string;
  type?: string;
};

export const checkInputDefaults = (
  input: HTMLElement,
  options: CheckOptions,
) => {
  expect(input).toHaveValue(options.value ?? '');
  expect(input).toHaveAttribute('type', options.type ?? 'text');
  expect(
    options.name === 'password' ? input.parentElement : input,
  ).toHaveAttribute('aria-invalid', options.invalid ?? 'false');
  expect(input).toHaveAttribute('name', options.name);
  expect(input).toHaveAttribute('placeholder', options.placeholder);
  expect(screen.getByText(options.label)).toBeVisible();
};

describe('SignupForm', () => {
  test('defaults', () => {
    // Setup
    const { result } = renderHook(() => useForm<SignupPayload>());

    // Render
    render(
      <SignupForm
        isLoading={false}
        showLogin={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

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

    // Assertions
    checkInputDefaults(firstnameInput, nameInputs[0]);
    checkInputDefaults(lastnameInput, nameInputs[1]);
    checkInputDefaults(usernameInput, credentialInputs[0]);
    checkInputDefaults(emailInput, credentialInputs[1]);
    checkInputDefaults(passwordInput, {
      ...credentialInputs[2],
      type: 'password',
    });
    expect(submitBtn).toBeVisible();
    expect(loginLink).toBeVisible();
    expect(screen.getByText(TEXT_SIGNUP_FOOTER)).toBeVisible();
  });

  test('isLoading', async () => {
    // Setup
    const { result } = renderHook(() => useForm<SignupPayload>());

    // Render
    render(
      <SignupForm
        isLoading
        showLogin={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );
    // Assertions
    expect(screen.getByTestId(TESTID_SIGNUP_LOADING)).toBeVisible();
  });

  test('errors', async () => {
    // Setup
    const { result } = renderHook(() => useForm<SignupPayload>());

    // Render
    render(
      <SignupForm
        isLoading={false}
        errors={{
          firstname: true,
          lastname: true,
          username: true,
          email: true,
          password: true,
        }}
        showLogin={jest.fn()}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Locate elements
    const firstnameInput = screen.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
    const lastnameInput = screen.getByPlaceholderText(PLACEHOLDER_LASTNAME);
    const usernameInput = screen.getByPlaceholderText(PLACEHOLDER_USERNAME);
    const emailInput = screen.getByPlaceholderText(PLACEHOLDER_EMAIL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);

    // Assertions
    expect(firstnameInput).toHaveAttribute('aria-invalid', 'true');
    expect(lastnameInput).toHaveAttribute('aria-invalid', 'true');
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput.parentElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('onSubmit called', async () => {
    // Setup
    const onSubmit = jest.fn().mockImplementation((e) => e.preventDefault());
    const { result } = renderHook(() => useForm<SignupPayload>());

    // Render
    render(
      <SignupForm
        isLoading={false}
        showLogin={jest.fn()}
        control={result.current.control}
        onSubmit={onSubmit}
      />,
    );

    // Locate elements
    const firstnameInput = screen.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
    const lastnameInput = screen.getByPlaceholderText(PLACEHOLDER_LASTNAME);
    const usernameInput = screen.getByPlaceholderText(PLACEHOLDER_USERNAME);
    const emailInput = screen.getByPlaceholderText(PLACEHOLDER_EMAIL);
    const passwordInput = screen.getByPlaceholderText(PLACEHOLDER_PASSWORD);
    const submitBtn = screen.getByRole('button', {
      name: ARIA_SUBMIT_SIGNUP,
    });

    // Type info on required fields
    await user.type(firstnameInput, 'jane');
    await user.type(lastnameInput, 'doe');
    await user.type(usernameInput, 'jopay');
    await user.type(emailInput, 'kamusta@ka.na');
    await user.type(passwordInput, 'wag-ka-nang-mawala');

    // Click submit button
    await user.click(submitBtn);

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('showLogin called', async () => {
    // Setup
    const showLogin = jest.fn();
    const { result } = renderHook(() => useForm<SignupPayload>());

    // Render
    render(
      <SignupForm
        isLoading={false}
        showLogin={showLogin}
        control={result.current.control}
        onSubmit={jest.fn()}
      />,
    );

    // Locate element
    const loginLink = screen.getByTestId(TESTID_LOGIN_LINK);

    // Click login link
    await user.click(loginLink);

    // Assert
    await waitFor(() => {
      expect(showLogin).toHaveBeenCalledTimes(1);
    });
  });
});
