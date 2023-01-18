import { DispatchWithoutAction } from 'react';

import { ActionIcon } from '@mantine/core';
import { HiMoon, HiOutlineSun } from 'react-icons/hi';

import {
  ARIA_MOON_ICON,
  ARIA_SUN_ICON,
  ARIA_TOGGLE_THEME,
} from '@lihim/shared/core';

type Props = {
  isDark: boolean;
  toggleTheme: DispatchWithoutAction;
};

export const ThemeToggle = ({ isDark, toggleTheme }: Props) => (
  <ActionIcon
    mr={3}
    aria-label={ARIA_TOGGLE_THEME}
    onClick={() => toggleTheme()}
  >
    {isDark ? (
      <HiOutlineSun title={ARIA_SUN_ICON} size={28} role="img" />
    ) : (
      <HiMoon title={ARIA_MOON_ICON} size={28} role="img" />
    )}
  </ActionIcon>
);
