import { ComponentProps } from 'react';

import { Center } from '@mantine/core';

import { MantineProvider } from '@lihim/shared/mantine';
import { Meta, StoryObj } from '@storybook/react';
import { useDarkMode } from 'storybook-dark-mode';

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
    text: 'Hello Storybook',
    // eslint-disable-next-line no-alert
    onClick: () => alert('Hello from storybook'),
  },
};
