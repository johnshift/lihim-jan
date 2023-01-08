import { DispatchWithoutAction } from 'react';

import { ActionIcon } from '@mantine/core';
import { HiMoon, HiOutlineSun } from 'react-icons/hi';

import { aria } from '../constants';

type Props = {
  isDark: boolean;
  toggleTheme: DispatchWithoutAction;
};

export const ThemeToggle = ({ isDark, toggleTheme }: Props) => (
  <ActionIcon
    mr={3}
    aria-label={aria.toggleTheme}
    onClick={() => toggleTheme()}
  >
    {isDark ? (
      <HiOutlineSun title={aria.sunIcon} size={28} />
    ) : (
      <HiMoon title={aria.moonIcon} size={28} />
    )}
  </ActionIcon>
);
