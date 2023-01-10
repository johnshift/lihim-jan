/* eslint-disable testing-library/no-node-access */

import { useForm } from 'react-hook-form';

import { Box } from '@mantine/core';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { aria, testid } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

export default {
  component: ValidatedInput,
  parameters: {
    darkMode: {
      current: 'dark', // Enforce dark theme on initial load
    },
  },
} as ComponentMeta<typeof ValidatedInput>;

const inputProps = {
  text: {
    name: 'text-name',
    label: 'Text Input',
    placeholder: 'Validated text input',
  },
  password: {
    name: 'password-name',
    label: 'Password Input',
    placeholder: 'Validated password input',
  },
};
const TEXT_ERROR = 'Text is invalid';
const PASSWORD_ERROR = 'Password is invalid';

const TextTemplate: ComponentStory<typeof ValidatedInput> = (args) => {
  const { control } = useForm();
  return (
    <Box sx={{ minWidth: '28ch' }}>
      <ValidatedInput
        control={control}
        inputProps={inputProps.text}
        {...args}
      />
    </Box>
  );
};

const PasswordTemplate: ComponentStory<typeof ValidatedInput> = (args) => {
  const { control } = useForm();
  return (
    <Box sx={{ minWidth: '28ch' }}>
      <ValidatedInput
        isPassword
        control={control}
        inputProps={inputProps.password}
        {...args}
      />
    </Box>
  );
};

export const DefaultTextInput = TextTemplate.bind({});
DefaultTextInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate input element
  const inputElement = canvas.getByPlaceholderText(inputProps.text.placeholder);

  // Assertions
  expect(inputElement).toHaveAttribute('type', 'text');
  expect(inputElement).toHaveAttribute('aria-invalid', 'false');
  expect(inputElement).toHaveAttribute('name', inputProps.text.name);
  expect(inputElement).toHaveAttribute(
    'placeholder',
    inputProps.text.placeholder,
  );
  expect(inputElement).toHaveValue('');
  expect(canvas.getByText(inputProps.text.label)).toBeInTheDocument();
};

export const TextInputError = TextTemplate.bind({});
TextInputError.args = {
  error: TEXT_ERROR,
};
TextInputError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate input element
  const inputElement = canvas.getByPlaceholderText(inputProps.text.placeholder);

  // Assertions
  expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  expect(canvas.getByText(TEXT_ERROR)).toBeVisible();
};

export const DefaultPasswordInput = PasswordTemplate.bind({});
DefaultPasswordInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate input element
  const inputElement = canvas.getByPlaceholderText(
    inputProps.password.placeholder,
  );

  // Assertions
  expect(inputElement).toHaveAttribute('type', 'password');
  expect(inputElement.parentElement).toHaveAttribute('aria-invalid', 'false');
  expect(inputElement).toHaveAttribute('name', inputProps.password.name);
  expect(inputElement).toHaveAttribute(
    'placeholder',
    inputProps.password.placeholder,
  );
  expect(inputElement).toHaveValue('');
  expect(canvas.getByText(inputProps.password.label)).toBeInTheDocument();
};

export const PasswordInputError = PasswordTemplate.bind({});
PasswordInputError.args = {
  error: PASSWORD_ERROR,
};
PasswordInputError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate input element
  const inputElement = canvas.getByPlaceholderText(
    inputProps.password.placeholder,
  );

  // Assertions
  expect(inputElement.parentElement).toHaveAttribute('aria-invalid', 'true');
  expect(canvas.getByText(PASSWORD_ERROR)).toBeVisible();
};

export const TogglePassword = PasswordTemplate.bind({});
TogglePassword.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Locate elements
  const inputElement = canvas.getByPlaceholderText(
    inputProps.password.placeholder,
  );
  const toggleVisibility = canvas.getByTestId(testid.passwordVisibility);

  // Toggle to visible text then assert
  await userEvent.click(toggleVisibility);
  expect(inputElement).toHaveAttribute('type', 'text');
  await canvas.findByText(aria.hidePasswordIcon);

  // Toggle to hidden then assert
  await userEvent.click(toggleVisibility);
  expect(inputElement).toHaveAttribute('type', 'password');
  await canvas.findByText(aria.showPasswordIcon);
};
