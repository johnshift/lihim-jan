import { setupServer } from 'msw/node';

import { mockSessionResponse } from '@lihim/auth/testutils';
import { TEXT_BRAND } from '@lihim/shared/core';
import { render, screen, user, within } from '@lihim/shared/testutils/feature';

import { Appbar } from './appbar';
import {
  ARIA_HEADER_MENU,
  ARIA_MOON_ICON,
  ARIA_SUN_ICON,
  ARIA_TOGGLE_THEME,
  TESTID_AUTH_MENUITEM,
} from './constants';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
beforeEach(() => mswServer.resetHandlers());
afterEach(() => mswServer.resetHandlers());

describe('Appbar', () => {
  test('defaults', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render component
    render(<Appbar />);

    // Assert brand defaults
    const brand = screen.getByText(TEXT_BRAND);
    expect(brand).toBeVisible();
    expect(brand.closest('a')).toHaveAttribute('href', '/');

    // Toggle theme
    const toggleTheme = screen.getByRole('button', {
      name: ARIA_TOGGLE_THEME,
    });
    expect(within(toggleTheme).getByText(ARIA_SUN_ICON)).toBeInTheDocument();
  });

  test('can toggle theme', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render component
    render(<Appbar />);

    // Assert default light mode
    const toggleTheme = screen.getByRole('button', {
      name: ARIA_TOGGLE_THEME,
    });
    expect(within(toggleTheme).getByText(ARIA_SUN_ICON)).toBeInTheDocument();

    // Assert can switch to dark theme
    await user.click(toggleTheme);
    expect(within(toggleTheme).getByText(ARIA_MOON_ICON)).toBeInTheDocument();

    // Assert can switch back to light theme
    await user.click(toggleTheme);
    expect(within(toggleTheme).getByText(ARIA_SUN_ICON)).toBeInTheDocument();
  });

  // TODO: replace this with toggle signin/signup forms
  test('open menu click auth action', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render component
    render(<Appbar />);

    // Open header menu
    await user.click(screen.getByRole('button', { name: ARIA_HEADER_MENU }));

    // Click action icon
    await user.click(screen.getByTestId(TESTID_AUTH_MENUITEM));
  });

  // TODO: signout error
  // TODO: signout ok
});
