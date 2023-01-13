import { useRouter } from 'next/router';

import { createStyles } from '@mantine/core';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { BiLogIn } from 'react-icons/bi';
import { CgFeed } from 'react-icons/cg';
import { HiOutlineSearch } from 'react-icons/hi';
import { IoMdPower } from 'react-icons/io';
import { RiSettings4Fill } from 'react-icons/ri';

import { AuthModalState, LoggedInSession } from '@lihim/auth/core';
import { useLogoutMutation } from '@lihim/auth/data-access';
import { TESTID_NAV_AUTH_ACTION } from '@lihim/shared/core';
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
    paddingBottom: 80,
    [theme.fn.smallerThan(theme.breakpoints.xs)]: {
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
    setAuthModalState,
  } = useRootContext();
  const openAuthModal = (isAnon: boolean) => {
    setAuthModalState(isAnon ? AuthModalState.Login : AuthModalState.Logout);
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
      <div className={classes.brand} />
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
            isDisabled={sessionIsLoading} // TODO: add logout loading condition
            onClick={() => openAuthModal(session.isAnon)}
          />
        </div>
      </div>
    </>
  );
};