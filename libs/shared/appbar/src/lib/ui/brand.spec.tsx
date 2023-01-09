import { texts } from '@lihim/shared/core';
import { render, screen } from '@lihim/shared/testutils/ui';

import { Brand } from './brand';

test('appbar brand', () => {
  // Render component
  render(<Brand />);

  // Get brand component
  const brand = screen.getByText(texts.brand);

  // Assert brand is visible
  expect(brand).toBeInTheDocument();

  // Assert brand links to home page
  expect(brand).toHaveAttribute('href', '/');
});
