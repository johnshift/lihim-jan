import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@storybook/testing-library';

import {
  ERR_LOGOUT_FAILED,
  MSG_LOGOUT_DONE,
  MSG_LOGOUT_LOADING,
  MSG_LOGOUT_OK,
  TESTID_LOGOUT_LOADING,
  TEXT_LOGOUT,
  TEXT_LOGOUT_SUBTITLE,
  TEXT_LOGOUT_TITLE,
} from '@lihim/auth/core';
import { LogoutForm } from '@lihim/auth/feature';
import { mockLogoutResponse, mockSessionResponse } from '@lihim/auth/testutils';
import { ERR_INTERNAL, TEXT_CANCEL, TEXT_LOADING } from '@lihim/shared/core';

export default {
  component: LogoutForm,
} as ComponentMeta<typeof LogoutForm>;

const Template: ComponentStory<typeof LogoutForm> = () => <LogoutForm />;

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

  // Assert visibility
  expect(canvas.getByText(TEXT_LOGOUT_TITLE)).toBeVisible();
  expect(canvas.getByText(TEXT_LOGOUT_SUBTITLE)).toBeVisible();
  expect(canvas.getByRole('button', { name: TEXT_CANCEL })).toBeVisible();
  expect(canvas.getByRole('button', { name: TEXT_LOGOUT })).toBeVisible();
};

export const Loading = Template.bind({});
Loading.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockLogoutResponse({
        delay: 50_000,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
Loading.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: TEXT_LOGOUT }));
  await waitFor(() => {
    expect(canvas.getByTestId(TESTID_LOGOUT_LOADING)).toBeVisible();
  });
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockLogoutResponse({
        delay: 300,
        status: 400,
        body: { message: ERR_INTERNAL },
      }),
    ],
  },
};
Error.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Click logout
  await userEvent.click(canvas.getByRole('button', { name: TEXT_LOGOUT }));

  // Wait for loading to finish
  await canvas.findByTestId(TESTID_LOGOUT_LOADING);
  await screen.findByText(TEXT_LOADING);
  await screen.findByText(MSG_LOGOUT_LOADING);
  await waitForElementToBeRemoved(() =>
    canvas.queryByTestId(TESTID_LOGOUT_LOADING),
  );

  // Assert notification
  await screen.findByText(ERR_LOGOUT_FAILED);
  await screen.findByText(ERR_INTERNAL);
};

export const Success = Template.bind({});
Success.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
      // Mock long running request
      mockLogoutResponse({
        delay: 300,
        status: 200,
        body: { message: MSG_LOGOUT_DONE },
      }),
    ],
  },
};
Success.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Click logout
  await userEvent.click(canvas.getByRole('button', { name: TEXT_LOGOUT }));

  // Wait for loading to finish
  await canvas.findByTestId(TESTID_LOGOUT_LOADING);
  await screen.findByText(TEXT_LOADING);
  await screen.findByText(MSG_LOGOUT_LOADING);
  await waitForElementToBeRemoved(() =>
    canvas.queryByTestId(TESTID_LOGOUT_LOADING),
  );

  // Assert notification
  await screen.findByText(MSG_LOGOUT_OK);
  await screen.findByText(MSG_LOGOUT_DONE);
};
