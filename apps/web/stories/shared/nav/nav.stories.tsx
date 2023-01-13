import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { fakeSession, mockSessionResponse } from '@lihim/auth/testutils';
import { Nav } from '@lihim/shared/nav';
import { PageLayout } from '@lihim/shared/ui';

export default {
  component: Nav,
} as ComponentMeta<typeof Nav>;

const Template: ComponentStory<typeof Nav> = () => (
  <PageLayout nav={<Nav />} appbar={<div />}>
    <h1>Content</h1>
  </PageLayout>
);

export const Anon = Template.bind({});
Anon.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, { isAnon: true }),
    ],
  },
};
Anon.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(canvas.getByRole('button', { name: 'Explore' })).toHaveAttribute(
    'data-active',
    'true',
  );

  expect(canvas.getByRole('button', { name: 'Search' })).toBeVisible();
  expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible();
  expect(canvas.getByRole('button', { name: 'Login' })).toBeVisible();
};

export const LoggedIn = Template.bind({});
LoggedIn.parameters = {
  msw: {
    handlers: [
      // Mock anon session
      mockSessionResponse(200, fakeSession()),
    ],
  },
};
LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByRole('button', { name: 'Home' })).toHaveAttribute(
    'data-active',
    'true',
  );

  expect(canvas.getByRole('button', { name: 'Profile' })).toBeVisible();
  expect(canvas.getByRole('button', { name: 'Search' })).toBeVisible();
  expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible();
  expect(canvas.getByRole('button', { name: 'Logout' })).toBeVisible();
};
