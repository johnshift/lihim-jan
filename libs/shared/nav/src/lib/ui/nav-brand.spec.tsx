import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TEXT_BRAND } from '@lihim/shared/core';
import { MantineProvider } from '@lihim/shared/mantine';

import { NavBrand } from './nav-brand';

describe('NavBrand', () => {
  test('brand click', async () => {
    // Setup
    const user = userEvent.setup();

    // Spy on next router
    const push = jest.fn();

    // Render component
    render(
      <MantineProvider>
        <NavBrand push={push} />
      </MantineProvider>,
    );

    // Click nav item
    await user.click(screen.getByRole('heading', { name: TEXT_BRAND }));

    // Assert push called
    expect(push).toHaveBeenCalledWith('/');
  });

  test('brand click (light)', async () => {
    // Setup
    const user = userEvent.setup();

    // Spy on next router
    const push = jest.fn();

    // Render component
    render(
      <MantineProvider colorScheme="light">
        <NavBrand push={push} />
      </MantineProvider>,
    );

    // Click nav item
    await user.click(screen.getByRole('heading', { name: TEXT_BRAND }));

    // Assert push called
    expect(push).toHaveBeenCalledWith('/');
  });
});
