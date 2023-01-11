import { useForm } from 'react-hook-form';

import { Group } from '@mantine/core';

import { expect } from '@storybook/jest';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { TESTID_SIGNUP_SKELETON } from '@lihim/auth/core';
import { SignupForm, SignupFormSkeleton } from '@lihim/auth/ui';
import { UiDecorator } from '@lihim/shared/testutils/storybook';

export default {
  component: SignupFormSkeleton,
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
} as ComponentMeta<typeof SignupFormSkeleton>;

const Template: ComponentStory<typeof SignupFormSkeleton> = () => {
  const { control } = useForm();

  return (
    <Group>
      <SignupFormSkeleton />
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
      />
    </Group>
  );
};

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId(TESTID_SIGNUP_SKELETON)).toBeVisible();
};
