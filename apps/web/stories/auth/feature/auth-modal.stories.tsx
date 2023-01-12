import { Button } from '@mantine/core';

import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';

import {
  AuthModalState,
  PLACEHOLDER_PRINCIPAL,
  TEXT_LOGIN_FOOTER,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import { AuthModal } from '@lihim/auth/feature';
import { mockSessionResponse } from '@lihim/auth/testutils';
import { useRootContext } from '@lihim/shared/data-access';

export default {
  component: AuthModal,
} as ComponentMeta<typeof AuthModal>;

const TESTID_SHOW = 'show-auth-modal';
const Template: ComponentStory<typeof AuthModal> = () => {
  const { setAuthModalState } = useRootContext();
  const show = () => setAuthModalState(AuthModalState.Login);

  return (
    <Button data-testid={TESTID_SHOW} onClick={show}>
      Show
    </Button>
  );
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

  // Open modal
  await userEvent.click(canvas.getByTestId(TESTID_SHOW));

  // Navigate to signup modal (also asserts login-form was shown)
  await userEvent.click(await screen.findByText(TEXT_LOGIN_FOOTER));

  // Navigate back to login-modal (also asserts signup-form was shown)
  await userEvent.click(await screen.findByText(TEXT_SIGNUP_FOOTER));

  // Close modal
  await userEvent.keyboard('{Escape}');

  // Assert modal closed
  await waitFor(() => {
    expect(
      screen.queryByPlaceholderText(PLACEHOLDER_PRINCIPAL),
    ).not.toBeInTheDocument();
  });
};
