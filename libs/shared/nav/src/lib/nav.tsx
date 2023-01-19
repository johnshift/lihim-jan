import { useRouter } from 'next/router';

import { createStyles } from '@mantine/core';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { BiLogIn } from 'react-icons/bi';
import { CgFeed } from 'react-icons/cg';
import { HiOutlineSearch } from 'react-icons/hi';
import { IoMdPower } from 'react-icons/io';
import { RiSettings4Fill } from 'react-icons/ri';

import { LoggedInSession } from '@lihim/auth/core';
import { TESTID_NAV_AUTH_ACTION, TEXT_BRAND } from '@lihim/shared/core';
import { useRootContext } from '@lihim/shared/data-access';

import { NavItem } from './ui/nav-item';

const commonNavs = [
  {
    icon: HiOutlineSearch,
    label: 'Search',
    href: '/search',
  },
  {
    icon: RiSettings4Fill,
    label: 'Settings',
    href: '/settings',
  },
];

const anonNavs = [
  {
    icon: CgFeed,
    label: 'Explore',
    href: '/',
  },
  ...commonNavs,
];

const loggedInNavs = [
  {
    icon: AiOutlineHome,
    label: 'Home',
    href: '/',
  },
  {
    icon: AiOutlineUser,
    label: 'Profile',
    href: '/profile',
  },
  ...commonNavs,
];

const getNavs = (pathname: string, isAnon: boolean, username?: string) =>
  [...(isAnon ? anonNavs : loggedInNavs)].map((nav) => ({
    ...nav,
    active: nav.href === pathname,
    href: nav.label === 'Profile' ? `/profile/${username}` : nav.href,
  }));

const useStyles = createStyles((theme) => ({
  brand: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: -10,
    fill: theme.colorScheme === 'dark' ? '#5C7CFA' : '#748FFC',
    [theme.fn.smallerThan(theme.breakpoints.xs)]: {
      display: 'none',
    },
    [theme.fn.smallerThan(theme.breakpoints.sm)]: {
      justifyContent: 'center',
      paddingLeft: 0,
      marginBottom: 0,
    },
  },
  svg: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  brandTitle: {
    paddingLeft: 10,
    userSelect: 'none',
    [theme.fn.smallerThan(theme.breakpoints.sm)]: {
      display: 'none',
    },
  },
  nav: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    [theme.fn.largerThan(theme.breakpoints.xs)]: {
      display: 'block',
    },
  },
  logout: {
    display: 'none',
    width: '100%',
    [theme.fn.largerThan(theme.breakpoints.xs)]: {
      display: 'block',
    },
  },
  separator: {
    [theme.fn.largerThan(theme.breakpoints.xs)]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '90vh',
    },
  },
}));

export const Nav = () => {
  // Router
  const { push, pathname } = useRouter();

  // Session
  const {
    isLoading: sessionIsLoading,
    session,
    authModalActions,
  } = useRootContext();
  const openAuthModal = (isAnon: boolean) => {
    isAnon ? authModalActions.openLogin() : authModalActions.openLogout();
  };

  // Styles
  const { classes } = useStyles();

  // Navs to display
  const navs = getNavs(
    pathname,
    session.isAnon,
    (session as LoggedInSession).username,
  );

  return (
    <>
      <div className={classes.brand} onClick={() => push('/')}>
        <svg
          viewBox="0 0 24 24"
          height="3em"
          width="3em"
          role="img"
          className={classes.svg}
        >
          <title>Brand Icon</title>
          <path d="M19 6H5C3.346 6 2 7.346 2 9v5c0 2.206 1.794 4 4 4h1.637c1.166 0 2.28-.557 2.981-1.491.66-.879 2.104-.88 2.764.001A3.744 3.744 0 0016.363 18H18c2.206 0 4-1.794 4-4V9c0-1.654-1.346-3-3-3zM7.5 13C6.119 13 5 12.328 5 11.5S6.119 10 7.5 10s2.5.672 2.5 1.5S8.881 13 7.5 13zm9 0c-1.381 0-2.5-.672-2.5-1.5s1.119-1.5 2.5-1.5 2.5.672 2.5 1.5-1.119 1.5-2.5 1.5z" />
        </svg>

        <h2 className={classes.brandTitle}>{TEXT_BRAND}</h2>
      </div>
      <div className={classes.separator}>
        <div className={classes.nav}>
          {navs.map((nav) => (
            <NavItem
              key={nav.label}
              label={nav.label}
              icon={<nav.icon size={24} />}
              isActive={nav.active}
              onClick={() => push(nav.href)}
            />
          ))}
        </div>
        <div className={classes.logout} data-testid={TESTID_NAV_AUTH_ACTION}>
          <NavItem
            label={session.isAnon ? 'Login' : 'Logout'}
            icon={
              session.isAnon ? <BiLogIn size={24} /> : <IoMdPower size={24} />
            }
            isDisabled={sessionIsLoading}
            onClick={() => openAuthModal(session.isAnon)}
          />
        </div>
      </div>
    </>
  );
};
