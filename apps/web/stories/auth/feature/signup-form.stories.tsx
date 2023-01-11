/* eslint-disable testing-library/no-node-access */
import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';

import {
  ARIA_SUBMIT_SIGNUP,
  ERR_SIGNUP_FAILED,
  MSG_SIGNUP_OK,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_FIRSTNAME,
  PLACEHOLDER_LASTNAME,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_USERNAME,
  SignupPayload,
  TESTID_LOGIN_LINK,
  TESTID_SIGNUP_LOADING,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import { credentialInputs, nameInputs } from '@lihim/auth/core';
import { SignupForm } from '@lihim/auth/feature';
import {
  fakeSession,
  fakeSignupPayload,
  mockSessionResponse,
  mockSignupResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL } from '@lihim/shared/core';
import { checkInputDefaults } from '@lihim/shared/testutils/storybook';

export default {
  component: SignupForm,
} as ComponentMeta<typeof SignupForm>;

const Template: ComponentStory<typeof SignupForm> = () => <SignupForm />;

const locateElements = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  // Locate elements
  const firstnameInput = canvas.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
  const lastnameInput = canvas.getByPlaceholderText(PLACEHOLDER_LASTNAME);
  const usernameInput = canvas.getByPlaceholderText(PLACEHOLDER_USERNAME);
  const emailInput = canvas.getByPlaceholderText(PLACEHOLDER_EMAIL);
  const passwordInput = canvas.getByPlaceholderText(PLACEHOLDER_PASSWORD);
  const submitBtn = canvas.getByRole('button', {
    name: ARIA_SUBMIT_SIGNUP,
  });
  const loginLink = canvas.getByTestId(TESTID_LOGIN_LINK);

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

const fillupForm = async (
  canvasElement: HTMLElement,
  _payload?: Partial<SignupPayload>,
) => {
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
  } = locateElements(canvasElement);

  // Fillup form
  await userEvent.type(firstnameInput, payload.firstname);
  await userEvent.type(lastnameInput, payload.lastname);
  await userEvent.type(usernameInput, payload.username);
  await userEvent.type(emailInput, payload.email);
  await userEvent.type(passwordInput, payload.password);
  await userEvent.click(submitBtn);
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
  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
    submitBtn,
    loginLink,
  } = locateElements(canvasElement);

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
};

export const Loading = Template.bind({});
Loading.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockSignupResponse({
        delay: 50_000,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
Loading.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(canvas.getByTestId(TESTID_SIGNUP_LOADING)).toBeVisible();
  });
};

export const ValidationFirstname = Template.bind({});
ValidationFirstname.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
ValidationFirstname.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement, { firstname: 'John!' });

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert invalid firstname field
  await waitFor(() => {
    expect(firstnameInput).toBeInvalid();
  });

  // Assert all other inputs not to be invalid
  expect(lastnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};

export const ValidationLastname = Template.bind({});
ValidationLastname.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
ValidationLastname.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement, { lastname: 'Smith!' });

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert invalid firstname field
  await waitFor(() => {
    expect(lastnameInput).toBeInvalid();
  });

  // Assert all other inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};

export const ValidationUsername = Template.bind({});
ValidationUsername.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
ValidationUsername.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement, { username: 'demo!' });

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert invalid firstname field
  await waitFor(() => {
    expect(usernameInput).toBeInvalid();
  });

  // Assert all other inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(lastnameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};

export const ValidationEmail = Template.bind({});
ValidationEmail.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
ValidationEmail.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement, { email: 'x@i.o' });

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert invalid firstname field
  await waitFor(() => {
    expect(emailInput).toBeInvalid();
  });

  // Assert all other inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(lastnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};

export const ValidationPassword = Template.bind({});
ValidationPassword.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 10_000,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
ValidationPassword.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement, { password: '12345' });

  // Assert instant (no loading)
  expect(screen.queryByTestId(TESTID_SIGNUP_LOADING)).not.toBeInTheDocument();

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert invalid firstname field
  await waitFor(() => {
    expect(passwordInput.parentElement).toBeInvalid();
  });

  // Assert all other inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(lastnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
};

const API_ERROR = 'Test api error';

export const ApiErrorFirstname = Template.bind({});
ApiErrorFirstname.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { field: 'firstname', message: API_ERROR },
      }),
    ],
  },
};
ApiErrorFirstname.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

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
};

export const ApiErrorLastname = Template.bind({});
ApiErrorLastname.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { field: 'lastname', message: API_ERROR },
      }),
    ],
  },
};
ApiErrorLastname.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

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
};

export const ApiErrorUsername = Template.bind({});
ApiErrorUsername.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { field: 'username', message: API_ERROR },
      }),
    ],
  },
};
ApiErrorUsername.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

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
};

export const ApiErrorEmail = Template.bind({});
ApiErrorEmail.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { field: 'email', message: API_ERROR },
      }),
    ],
  },
};
ApiErrorEmail.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

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
};

export const ApiErrorPassword = Template.bind({});
ApiErrorPassword.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { field: 'password', message: API_ERROR },
      }),
    ],
  },
};
ApiErrorPassword.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

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
};

export const InternalError = Template.bind({});
InternalError.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
InternalError.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert notification
  await waitFor(() => {
    expect(screen.getByText(ERR_SIGNUP_FAILED)).toBeInTheDocument();
  });
  expect(screen.getByText(ERR_INTERNAL)).toBeInTheDocument();

  // Assert all inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(lastnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};

export const Success = Template.bind({});
Success.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock error response (long delay since validation is instant)
      // Should not display loading overlay
      mockSignupResponse({
        delay: 300,
        status: 200,
        body: { message: 'Welcome test-user!', session: fakeSession() },
      }),
    ],
  },
};
Success.play = async ({ canvasElement }) => {
  await fillupForm(canvasElement);

  // Loading should appear
  await screen.findByTestId(TESTID_SIGNUP_LOADING);

  // Locate elements
  const {
    firstnameInput,
    lastnameInput,
    usernameInput,
    emailInput,
    passwordInput,
  } = locateElements(canvasElement);

  // Assert notification
  await waitFor(() => {
    expect(screen.getByText(MSG_SIGNUP_OK)).toBeInTheDocument();
  });
  expect(screen.getByText('Welcome test-user!')).toBeInTheDocument();

  // Assert all inputs not to be invalid
  expect(firstnameInput).not.toBeInvalid();
  expect(lastnameInput).not.toBeInvalid();
  expect(usernameInput).not.toBeInvalid();
  expect(emailInput).not.toBeInvalid();
  expect(passwordInput.parentElement).not.toBeInvalid();
};
