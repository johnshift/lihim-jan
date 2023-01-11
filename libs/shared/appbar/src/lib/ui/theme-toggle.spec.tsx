import { render, screen, user, within } from '@lihim/shared/testutils/ui';

import { ARIA_MOON_ICON, ARIA_SUN_ICON, ARIA_TOGGLE_THEME } from '../constants';

import { ThemeToggle } from './theme-toggle';

describe('appbar theme-toggle', () => {
  test('light theme', async () => {
    // Arrange props
    const isDark = false;
    const toggleTheme = jest.fn();

    // Render component
    render(<ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />);

    // Assert light theme components
    const button = await screen.findByRole('button', {
      name: ARIA_TOGGLE_THEME,
    });
    expect(within(button).getByText(ARIA_MOON_ICON)).toBeInTheDocument();

    // Assert button can be clicked
    await user.click(button);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  test('dark theme', async () => {
    // Arrange props
    const isDark = true;
    const toggleTheme = jest.fn();

    // Render component
    render(<ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />);

    // Assert light theme components
    const button = await screen.findByRole('button', {
      name: ARIA_TOGGLE_THEME,
    });
    expect(within(button).getByText(ARIA_SUN_ICON)).toBeInTheDocument();

    // Assert button can be clicked
    await user.click(button);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
