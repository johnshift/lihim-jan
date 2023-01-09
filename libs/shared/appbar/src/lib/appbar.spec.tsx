import { setupServer } from 'msw/node';

import { mockSessionResponse } from '@lihim/auth/testutils';
import { texts } from '@lihim/shared/core';
import { render, screen, user, within } from '@lihim/shared/testutils/feature';

import { Appbar } from './appbar';
import { aria, testid } from './constants';

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
    const brand = screen.getByText(texts.brand);
    expect(brand).toBeVisible();
    expect(brand.closest('a')).toHaveAttribute('href', '/');

    // Toggle theme
    const toggleTheme = screen.getByRole('button', {
      name: aria.toggleTheme,
    });
    expect(within(toggleTheme).getByText(aria.sunIcon)).toBeInTheDocument();
  });

  test('can toggle theme', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render component
    render(<Appbar />);

    // Assert default light mode
    const toggleTheme = screen.getByRole('button', {
      name: aria.toggleTheme,
    });
    expect(within(toggleTheme).getByText(aria.sunIcon)).toBeInTheDocument();

    // Assert can switch to dark theme
    await user.click(toggleTheme);
    expect(within(toggleTheme).getByText(aria.moonIcon)).toBeInTheDocument();

    // Assert can switch back to light theme
    await user.click(toggleTheme);
    expect(within(toggleTheme).getByText(aria.sunIcon)).toBeInTheDocument();
  });

  // TODO: replace this with toggle signin/signup forms
  test('open menu click auth action', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }));

    // Render component
    render(<Appbar />);

    // Open header menu
    await user.click(screen.getByRole('button', { name: aria.headerMenu }));

    // Click action icon
    await user.click(screen.getByTestId(testid.authMenuItem));
  });

  // TODO: signout error
  // TODO: signout ok
});
