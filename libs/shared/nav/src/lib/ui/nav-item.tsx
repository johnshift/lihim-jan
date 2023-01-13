import type { FC, ReactNode } from 'react';

import { NavLink } from '@mantine/core';

import { TVoidFn } from '@lihim/shared/core';

type Props = {
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: TVoidFn;
};

export const NavItem: FC<Props> = ({
  label,
  icon,
  isActive,
  onClick,
  isDisabled,
}) => (
  <NavLink
    label={label}
    icon={icon}
    variant="light"
    active={isActive}
    styles={(theme) => ({
      root: {
        height: 70,
        paddingLeft: 30,
        borderRadius: '10px 0 0 10px',
      },
      label: {
        fontSize: 17,
        fontWeight: isActive ? 700 : 400,
        paddingLeft: 5,
        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
          display: 'none',
        },
      },
      icon: {
        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
          width: '100%',
        },
      },
    })}
    disabled={isDisabled}
    onClick={onClick}
  />
);
