/* eslint-disable testing-library/no-node-access */

import { ComponentProps } from 'react';

import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { Appbar, appbarAria } from '@lihim/shared/appbar';
import { texts } from '@lihim/shared/core';

type Props = ComponentProps<typeof Appbar>;

export default {
  component: Appbar,
  parameters: {
    darkMode: {
      current: 'dark', // Enforce dark theme on initial load
    },
  },
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {},
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    // Assert brand defaults
    const brand = canvas.getByText(texts.brand);
    expect(brand).toBeVisible();
    expect(brand.closest('a')).toHaveAttribute('href', '/');

    // Toggle theme (dark mode set in parameters)
    const toggleTheme = canvas.getByRole('button', {
      name: appbarAria.toggleTheme,
    });
    expect(toggleTheme).toBeVisible();
    const toggleThemeIcon = await within(toggleTheme).findByRole('img', {
      name: appbarAria.sunIcon,
    });
    expect(toggleThemeIcon).toBeVisible();
  },
};

export const ToggleTheme: StoryObj<Props> = {
  args: {},
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    // Locate theme-toggle component
    const findThemeToggle = async () =>
      canvas.findByRole('button', {
        name: appbarAria.toggleTheme,
      });

    // Toggle theme and assert theme switched
    await userEvent.click(await findThemeToggle());
    expect(
      await canvas.findByRole('img', { name: appbarAria.moonIcon }),
    ).toBeVisible();

    // Toggle and assert again
    await userEvent.click(await findThemeToggle());
    expect(
      await canvas.findByRole('img', { name: appbarAria.sunIcon }),
    ).toBeVisible();
  },
};

// TODO: toggle signin/signup errors
// TODO: login error
// TODO: logout error
// TODO: signup error