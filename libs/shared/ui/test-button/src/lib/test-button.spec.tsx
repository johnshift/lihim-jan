import { ColorScheme } from '@mantine/core';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MantineProvider } from '@lihim/shared/mantine';

import { TestButton } from './test-button';

type TestCase = [ColorScheme];

describe('TestButton', () => {
  // Setup
  const user = userEvent.setup();

  test.each<TestCase>([['light'], ['dark']])(
    'default (%s mode)',
    async (colorScheme) => {
      const text = 'Test Button';
      const onClick = jest.fn();

      render(
        <MantineProvider colorScheme={colorScheme}>
          <TestButton text={text} onClick={onClick} />
        </MantineProvider>,
      );

      // Expect defaults
      expect(screen.getByTestId('clicked-status')).toHaveTextContent('false');

      // Click button
      await user.click(screen.getByRole('button', { name: text }));

      // Expect toggled text
      expect(screen.getByTestId('clicked-status')).toHaveTextContent('true');
    },
  );
});
