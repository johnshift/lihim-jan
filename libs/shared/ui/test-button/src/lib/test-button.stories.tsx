import { ComponentProps } from 'react';

import { Center } from '@mantine/core';

import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { useDarkMode } from 'storybook-dark-mode';

import { MantineProvider } from '@lihim/shared/mantine';

import { TestButton } from './test-button';

type TestButtonProps = ComponentProps<typeof TestButton>;

export default {
  component: TestButton,
  decorators: [
    (Story) => (
      <MantineProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
        <Center style={{ width: '100vw', height: '100vh' }}>
          <Story />
        </Center>
      </MantineProvider>
    ),
  ],
} as Meta<TestButtonProps>;

export const Primary: StoryObj<TestButtonProps> = {
  args: {
    text: 'Hello from Storybook',
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    // Expect defaults
    expect(canvas.getByTestId('clicked-status')).toHaveTextContent('false');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Hello from Storybook' }),
    );

    // Expect defaults
    expect(canvas.getByTestId('clicked-status')).toHaveTextContent('true');
  },
};
