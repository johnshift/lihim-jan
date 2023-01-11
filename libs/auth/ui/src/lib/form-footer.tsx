import { FC } from 'react';

import { Button, Group, Text } from '@mantine/core';

import {
  authAria,
  authTestId,
  TEXT_LOGIN,
  TEXT_LOGIN_FOOTER,
  TEXT_SIGNUP,
  TEXT_SIGNUP_FOOTER,
} from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';

type Props = {
  isSignup?: boolean;
  onClick: TVoidFn;
};

export const FormFooter: FC<Props> = ({ isSignup = false, onClick }) => (
  <Group position="apart">
    <Text
      color="dimmed"
      size="sm"
      sx={(theme) => ({
        '&:hover': { color: theme.colors.blue[4], cursor: 'pointer' },
      })}
      data-testid={
        isSignup ? authTestId.signupFooterLink : authTestId.loginFooterLink
      }
      onClick={onClick}
    >
      {isSignup ? TEXT_SIGNUP_FOOTER : TEXT_LOGIN_FOOTER}
    </Text>
    <Button
      type="submit"
      size="sm"
      aria-label={isSignup ? authAria.submitSignup : authAria.submitLogin}
      radius="md"
    >
      {isSignup ? TEXT_SIGNUP : TEXT_LOGIN}
    </Button>
  </Group>
);
