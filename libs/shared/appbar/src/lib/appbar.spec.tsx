import { setupServer } from 'msw/node';

import {
  fakeSession,
  mockLogoutResponse,
  mockSessionResponse,
} from '@lihim/auth/testutils';
import {
  ARIA_HEADER_MENU,
  ARIA_MOON_ICON,
  ARIA_SUN_ICON,
  ARIA_TOGGLE_THEME,
  TESTID_AUTH_MENUITEM,
  TESTID_HEADER_LOADER,
} from '@lihim/shared/core';
import {
  render,
  screen,
  user,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@lihim/shared/testutils/feature';

import { Appbar } from './appbar';

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

  test('anon auth action', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }, 200));

    // Render component
    render(<Appbar />);

    // Open header menu
    await user.click(screen.getByRole('button', { name: ARIA_HEADER_MENU }));

    // Wait for loading to appear then disappear
    await screen.findByTestId(TESTID_HEADER_LOADER);
    await waitForElementToBeRemoved(
      () => screen.queryByTestId(TESTID_HEADER_LOADER),
      { timeout: 3000 },
    );

    // Click action icon
    await user.click(screen.getByTestId(TESTID_AUTH_MENUITEM));
  });

  test('loggedin auth action', async () => {
    // Mock loggedIn
    mswServer.use(
      mockSessionResponse(200, fakeSession(), 200),
      mockLogoutResponse({ status: 200 }),
    );

    // Render component
    render(<Appbar />);

    // Open header menu
    await user.click(screen.getByRole('button', { name: ARIA_HEADER_MENU }));

    // Wait for loading to appear then disappear
    await screen.findByTestId(TESTID_HEADER_LOADER);
    await waitForElementToBeRemoved(
      () => screen.queryByTestId(TESTID_HEADER_LOADER),
      { timeout: 3000 },
    );

    // Click action icon
    await user.click(screen.getByTestId(TESTID_AUTH_MENUITEM));
  });

  test('search input in-progress message', async () => {
    // Mock not loggedIn
    mswServer.use(mockSessionResponse(200, { isAnon: true }, 200));

    // Mock alert
    const mockAlert = jest.fn();
    jest.spyOn(window, 'alert').mockImplementationOnce(mockAlert);

    // Render component
    render(<Appbar />);

    // Type something in search bar then submit
    await user.type(screen.getByPlaceholderText('Search'), 'something');
    await user.keyboard('{Enter}');

    // Assert alert message
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Search feature is currently in progress',
      );
    });
  });
});
