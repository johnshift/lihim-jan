import { ComponentProps } from 'react';

import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { TestButton } from '@lihim/shared/ui/test-button';

type TestButtonProps = ComponentProps<typeof TestButton>;

export default {
  component: TestButton,
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
