import { Burger, Loader, Menu as BaseMenu } from '@mantine/core';
import { HiLogin } from 'react-icons/hi';

import { TEXT_LOGIN, TEXT_LOGOUT } from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { TEXT_LOADING } from '@lihim/shared/core';

import {
  ARIA_AUTH_ICON,
  ARIA_HEADER_MENU,
  TESTID_AUTH_MENUITEM,
  TESTID_HEADER_LOADER,
} from '../constants';

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  onOpen: TVoidFn;
  onClose: TVoidFn;
  authFn: TVoidFn;
};

export const Menu = (props: Props) => (
  <BaseMenu
    width={180}
    shadow="md"
    opened={props.isOpen}
    position="bottom-end"
    aria-label={ARIA_HEADER_MENU}
    onOpen={props.onOpen}
    onClose={props.onClose}
  >
    <BaseMenu.Target>
      <Burger opened={props.isOpen} size="sm" ml={5} />
    </BaseMenu.Target>

    <BaseMenu.Dropdown>
      <BaseMenu.Label>Actions</BaseMenu.Label>
      <BaseMenu.Item
        icon={
          props.isLoading ? (
            <Loader size="xs" data-testid={TESTID_HEADER_LOADER} />
          ) : (
            <HiLogin title={ARIA_AUTH_ICON} />
          )
        }
        disabled={props.isLoading}
        data-testid={TESTID_AUTH_MENUITEM}
        onClick={props.authFn}
      >
        {props.isLoading
          ? TEXT_LOADING
          : props.isLoggedIn
          ? TEXT_LOGOUT
          : TEXT_LOGIN}
      </BaseMenu.Item>
    </BaseMenu.Dropdown>
  </BaseMenu>
);
