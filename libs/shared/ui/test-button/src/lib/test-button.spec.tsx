import { render, screen, user } from '@lihim/shared/testutils/ui';

import { TestButton } from './test-button';

describe('TestButton', () => {
  test('defaults', async () => {
    // Setup
    const text = 'My Button';

    // Render component
    render(<TestButton text={text} />);

    // Expect default to false
    expect(screen.getByTestId('clicked-status')).toHaveTextContent('false');

    // Click button
    await user.click(screen.getByRole('button', { name: text }));

    // Expect text toggled to true
    expect(screen.getByTestId('clicked-status')).toHaveTextContent('true');
  });
});
