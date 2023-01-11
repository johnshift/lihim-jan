/* eslint-disable testing-library/no-node-access */
import { useForm } from 'react-hook-form';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import {
  ARIA_SUBMIT_LOGIN,
  authInputProps,
  authTestId,
  TEXT_LOGIN_FOOTER,
} from '@lihim/auth/core';
import { LoginForm } from '@lihim/auth/ui';
import { checkInputDefaults } from '@lihim/shared/testutils/storybook';

export default {
  component: LoginForm,
  parameters: {
    darkMode: {
      current: 'dark', // Enforce dark theme on initial load
    },
  },
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => {
  const { control } = useForm();

  return (
    <LoginForm
      isLoading={false}
      hasError={false}
      showSignup={() => null}
      control={control}
      onSubmit={() => null}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate elements
  const principalInput = canvas.getByPlaceholderText(
    authInputProps.principal.placeholder,
  );
  const passwordInput = canvas.getByPlaceholderText(
    authInputProps.password.placeholder,
  );
  const submitBtn = canvas.getByRole('button', { name: ARIA_SUBMIT_LOGIN });
  const signupLink = canvas.getByTestId(authTestId.loginFooterLink);

  // Assert input defaults
  checkInputDefaults(principalInput, authInputProps.principal);
  checkInputDefaults(passwordInput, {
    ...authInputProps.password,
    type: 'password',
  });
  expect(submitBtn).toBeVisible();
  expect(signupLink).toBeVisible();
  expect(canvas.getByText(TEXT_LOGIN_FOOTER)).toBeVisible();
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
Loading.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(authTestId.loginLoadingOverlay)).toBeVisible();
};

export const HasError = Template.bind({});
HasError.args = {
  hasError: true,
};
HasError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const principalInput = canvas.getByPlaceholderText(
    authInputProps.principal.placeholder,
  );
  const passwordInput = canvas.getByPlaceholderText(
    authInputProps.password.placeholder,
  );
  expect(principalInput).toHaveAttribute('aria-invalid', 'true');
  expect(passwordInput.parentElement).toHaveAttribute('aria-invalid', 'true');
};
