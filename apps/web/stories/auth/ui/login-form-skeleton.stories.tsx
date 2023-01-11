import { useForm } from 'react-hook-form';

import { Group } from '@mantine/core';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { TESTID_LOGIN_SKELETON } from '@lihim/auth/core';
import { LoginFormSkeleton } from '@lihim/auth/ui';
import { LoginForm } from '@lihim/auth/ui';
import { UiDecorator } from '@lihim/shared/testutils/storybook';

export default {
  component: LoginFormSkeleton,
  parameters: {
    darkMode: {
      current: 'dark', // Enforce dark theme on initial load
    },
  },
  decorators: [
    (Story) => (
      <UiDecorator>
        <Story />
      </UiDecorator>
    ),
  ],
} as ComponentMeta<typeof LoginFormSkeleton>;

const Template: ComponentStory<typeof LoginFormSkeleton> = () => {
  const { control } = useForm();

  return (
    <Group>
      <LoginFormSkeleton />
      <LoginForm
        isLoading={false}
        hasError={false}
        showSignup={() => null}
        control={control}
        onSubmit={() => null}
      />
    </Group>
  );
};

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(TESTID_LOGIN_SKELETON)).toBeVisible();
};
