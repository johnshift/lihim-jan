import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import {
  TESTID_LOGOUT_LOADING,
  TEXT_LOGOUT,
  TEXT_LOGOUT_SUBTITLE,
  TEXT_LOGOUT_TITLE,
} from '@lihim/auth/core';
import { LogoutForm } from '@lihim/auth/ui';
import { TEXT_CANCEL } from '@lihim/shared/core';
export default {
  component: LogoutForm,
  args: {
    isLoading: false,
    onCancel: () => console.log('on cancel'),
    onSubmit: () => console.log('on submit'),
  },
} as ComponentMeta<typeof LogoutForm>;

const Template: ComponentStory<typeof LogoutForm> = (args) => (
  <LogoutForm {...args} />
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText(TEXT_LOGOUT_TITLE)).toBeVisible();
  expect(canvas.getByText(TEXT_LOGOUT_SUBTITLE)).toBeVisible();
  expect(canvas.getByRole('button', { name: TEXT_CANCEL })).toBeVisible();
  expect(canvas.getByRole('button', { name: TEXT_LOGOUT })).toBeVisible();
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
Loading.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(TESTID_LOGOUT_LOADING)).toBeVisible();
};
