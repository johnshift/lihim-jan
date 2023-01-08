import { DispatchWithoutAction } from 'react';

import { Burger, Loader, Menu as BaseMenu } from '@mantine/core';
import { HiLogin } from 'react-icons/hi';

import { authTexts } from '@lihim/auth/core';
import { texts } from '@lihim/shared/core';

import { aria, testid } from '../constants';

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  onOpen: DispatchWithoutAction;
  onClose: DispatchWithoutAction;
  authFn: DispatchWithoutAction;
};

export const Menu = (props: Props) => (
  <BaseMenu
    width={180}
    shadow="md"
    opened={props.isOpen}
    position="bottom-end"
    aria-label={aria.headerMenu}
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
            <Loader size="xs" data-testid={testid.headerLoader} />
          ) : (
            <HiLogin title={aria.authIcon} />
          )
        }
        disabled={props.isLoading}
        data-testid={testid.authMenuItem}
        onClick={props.authFn}
      >
        {props.isLoading
          ? texts.loading
          : props.isLoggedIn
          ? authTexts.logout
          : authTexts.login}
      </BaseMenu.Item>
    </BaseMenu.Dropdown>
  </BaseMenu>
);
