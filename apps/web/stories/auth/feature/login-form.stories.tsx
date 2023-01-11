/* eslint-disable testing-library/no-node-access */

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';

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
import { LoginForm } from '@lihim/auth/feature';
import {
  fakeSession,
  mockLoginResponse,
  mockSessionResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL, ERR_INVALID_REQUEST } from '@lihim/shared/core';
import { checkInputDefaults } from '@lihim/shared/testutils/storybook';

export default {
  component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = () => <LoginForm />;

const fillSignin = async (
  canvasElement: HTMLElement,
  principal?: string,
  password?: string,
) => {
  const canvas = within(canvasElement);

  // Components
  const principalInput = await canvas.findByPlaceholderText(
    PLACEHOLDER_PRINCIPAL,
  );
  const passwordInput = await canvas.findByPlaceholderText(
    PLACEHOLDER_PASSWORD,
  );

  // Type invalid payload
  userEvent.type(principalInput, principal || 'demo');
  userEvent.type(passwordInput, password || '123456');
  userEvent.keyboard('{Enter}');
};

const assertIncorrectLogin = async (isInternal = false) => {
  // Assert notification
  await screen.findByText(ERR_LOGIN_FAILED);
  expect(screen.getByText(ERR_LOGIN_FAILED)).toBeInTheDocument();
  expect(
    screen.getByText(isInternal ? ERR_INTERNAL : ERR_LOGIN_INCORRECT),
  ).toBeInTheDocument();

  if (isInternal) {
    // Assert no red borders for internal error
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL),
    ).not.toBeInvalid();
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).not.toBeInvalid();
  } else {
    // Assert red borders
    await waitFor(() => {
      expect(screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL)).toBeInvalid();
    });
    expect(
      screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
    ).toBeInvalid();
  }
};

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
    ],
  },
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate elements
  const principalInput = canvas.getByPlaceholderText(PLACEHOLDER_PRINCIPAL);
  const passwordInput = canvas.getByPlaceholderText(PLACEHOLDER_PASSWORD);
  const submitBtn = canvas.getByRole('button', { name: ARIA_SUBMIT_LOGIN });
  const signupLink = canvas.getByTestId(TESTID_SIGNUP_LINK);

  // Assert input defaults
  await checkInputDefaults(principalInput, loginInputs[0]);
  await checkInputDefaults(passwordInput, {
    ...loginInputs[1],
    type: 'password',
  });
  expect(submitBtn).toBeVisible();
  expect(signupLink).toBeVisible();
  expect(canvas.getByText(TEXT_LOGIN_FOOTER)).toBeVisible();
};

export const Loading = Template.bind({});
Loading.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockLoginResponse({
        delay: 50_000,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
Loading.play = async ({ canvasElement }) => {
  await fillSignin(canvasElement);

  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(canvas.getByTestId(TESTID_LOGIN_LOADING)).toBeVisible();
  });
};

export const ValidationError = Template.bind({});
ValidationError.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockLoginResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};

ValidationError.play = async ({ canvasElement }) => {
  await fillSignin(canvasElement, 'demo!', '12345');

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_LOGIN_LOADING)).not.toBeInTheDocument();

  // Assert incorrect login
  await assertIncorrectLogin();
};

export const ApiError = Template.bind({});
ApiError.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response
      mockLoginResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INVALID_REQUEST },
      }),
    ],
  },
};
ApiError.play = async ({ canvasElement }) => {
  await fillSignin(canvasElement);

  // Assert loading is visible
  await screen.findByTestId(TESTID_LOGIN_LOADING);

  // Assert incorrect login
  await assertIncorrectLogin();
};

export const InternalError = Template.bind({});
InternalError.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response
      mockLoginResponse({
        delay: 300,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
InternalError.play = async ({ canvasElement }) => {
  await fillSignin(canvasElement);

  // Assert loading is visible
  await screen.findByTestId(TESTID_LOGIN_LOADING);

  // Assert incorrect login
  await assertIncorrectLogin(true);
};

export const Success = Template.bind({});
Success.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response
      mockLoginResponse({
        delay: 300,
        status: 200,
        body: { message: MSG_LOGIN_OK_INFO, session: fakeSession() },
      }),
    ],
  },
};
Success.play = async ({ canvasElement }) => {
  await fillSignin(canvasElement);

  // Assert loading is visible
  await screen.findByTestId(TESTID_LOGIN_LOADING);

  // Assert notification
  await screen.findByText(MSG_LOGIN_OK);
  expect(screen.getByText(MSG_LOGIN_OK_INFO)).toBeInTheDocument();

  // Assert no red borders
  expect(screen.getByPlaceholderText(PLACEHOLDER_PRINCIPAL)).not.toBeInvalid();
  expect(
    screen.getByPlaceholderText(PLACEHOLDER_PASSWORD).parentElement,
  ).not.toBeInvalid();
};
