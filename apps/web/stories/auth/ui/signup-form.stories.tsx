/* eslint-disable testing-library/no-node-access */
import { useForm } from 'react-hook-form';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import {
  ARIA_SUBMIT_SIGNUP,
  credentialInputs,
  nameInputs,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_FIRSTNAME,
  PLACEHOLDER_LASTNAME,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_USERNAME,
  TESTID_LOGIN_LINK,
  TESTID_SIGNUP_LOADING,
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
  const firstnameInput = canvas.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
  const lastnameInput = canvas.getByPlaceholderText(PLACEHOLDER_LASTNAME);
  const usernameInput = canvas.getByPlaceholderText(PLACEHOLDER_USERNAME);
  const emailInput = canvas.getByPlaceholderText(PLACEHOLDER_EMAIL);
  const passwordInput = canvas.getByPlaceholderText(PLACEHOLDER_PASSWORD);
  const submitBtn = canvas.getByRole('button', { name: ARIA_SUBMIT_SIGNUP });
  const loginLink = canvas.getByTestId(TESTID_LOGIN_LINK);

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
  expect(canvas.getByText(TEXT_SIGNUP_FOOTER)).toBeVisible();
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
Loading.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(TESTID_SIGNUP_LOADING)).toBeVisible();
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
  const firstnameInput = canvas.getByPlaceholderText(PLACEHOLDER_FIRSTNAME);
  const lastnameInput = canvas.getByPlaceholderText(PLACEHOLDER_LASTNAME);
  const usernameInput = canvas.getByPlaceholderText(PLACEHOLDER_USERNAME);
  const emailInput = canvas.getByPlaceholderText(PLACEHOLDER_EMAIL);
  const passwordInput = canvas.getByPlaceholderText(PLACEHOLDER_PASSWORD);
  expect(firstnameInput).toHaveAttribute('aria-invalid', 'true');
  expect(lastnameInput).toHaveAttribute('aria-invalid', 'true');
  expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
  expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  expect(passwordInput.parentElement).toHaveAttribute('aria-invalid', 'true');
};
