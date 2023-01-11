/* eslint-disable testing-library/no-node-access */
import { useForm } from 'react-hook-form';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import {
  authAria,
  authInputProps,
  authTestId,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import { SignupForm } from '@lihim/auth/ui';
import { checkInputDefaults } from '@lihim/shared/testutils/storybook';

export default {
  component: SignupForm,
  parameters: {
    darkMode: {
      current: 'dark', // Enforce dark theme on initial load
    },
  },
} as ComponentMeta<typeof SignupForm>;

const Template: ComponentStory<typeof SignupForm> = (args) => {
  const { control } = useForm();

  return (
    <SignupForm
      isLoading={false}
      errors={{
        firstname: false,
        lastname: false,
        username: false,
        email: false,
        password: false,
      }}
      showLogin={() => null}
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
  const firstnameInput = canvas.getByPlaceholderText(
    authInputProps.firstname.placeholder,
  );
  const lastnameInput = canvas.getByPlaceholderText(
    authInputProps.lastname.placeholder,
  );
  const usernameInput = canvas.getByPlaceholderText(
    authInputProps.username.placeholder,
  );
  const emailInput = canvas.getByPlaceholderText(
    authInputProps.email.placeholder,
  );
  const passwordInput = canvas.getByPlaceholderText(
    authInputProps.password.placeholder,
  );
  const submitBtn = canvas.getByRole('button', { name: authAria.submitSignup });
  const loginLink = canvas.getByTestId(authTestId.signupFooterLink);

  // Assertions
  checkInputDefaults(firstnameInput, authInputProps.firstname);
  checkInputDefaults(lastnameInput, authInputProps.lastname);
  checkInputDefaults(usernameInput, authInputProps.username);
  checkInputDefaults(emailInput, authInputProps.email);
  checkInputDefaults(passwordInput, {
    ...authInputProps.password,
    type: 'password',
  });
  expect(submitBtn).toBeVisible();
  expect(loginLink).toBeVisible();
  expect(canvas.getByText(TEXT_SIGNUP_FOOTER)).toBeVisible();
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
Loading.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(authTestId.signupLoadingOverlay)).toBeVisible();
};

export const Errors = Template.bind({});
Errors.args = {
  errors: {
    firstname: true,
    lastname: true,
    username: true,
    email: true,
    password: true,
  },
};
Errors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const firstnameInput = canvas.getByPlaceholderText(
    authInputProps.firstname.placeholder,
  );
  const lastnameInput = canvas.getByPlaceholderText(
    authInputProps.lastname.placeholder,
  );
  const usernameInput = canvas.getByPlaceholderText(
    authInputProps.username.placeholder,
  );
  const emailInput = canvas.getByPlaceholderText(
    authInputProps.email.placeholder,
  );
  const passwordInput = canvas.getByPlaceholderText(
    authInputProps.password.placeholder,
  );
  expect(firstnameInput).toHaveAttribute('aria-invalid', 'true');
  expect(lastnameInput).toHaveAttribute('aria-invalid', 'true');
  expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
  expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  expect(passwordInput.parentElement).toHaveAttribute('aria-invalid', 'true');
};
