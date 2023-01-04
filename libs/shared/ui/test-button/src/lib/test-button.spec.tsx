import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';

import * as stories from './test-button.stories';

const { Primary } = composeStories(stories);

describe('TestButton', () => {
  test('defaults', async () => {
    const { container } = render(<Primary />);

    // Expect defaults
    expect(screen.getByTestId('clicked-status')).toHaveTextContent('false');

    await Primary.play({ canvasElement: container });
  });
});
