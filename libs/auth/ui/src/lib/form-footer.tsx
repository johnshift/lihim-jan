import { FC } from 'react';

import { Button, Group, Text } from '@mantine/core';

import {
  ARIA_SUBMIT_LOGIN,
  ARIA_SUBMIT_SIGNUP,
  TESTID_LOGIN_LINK,
  TESTID_SIGNUP_LINK,
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
      data-testid={isSignup ? TESTID_LOGIN_LINK : TESTID_SIGNUP_LINK}
      onClick={onClick}
    >
      {isSignup ? TEXT_SIGNUP_FOOTER : TEXT_LOGIN_FOOTER}
    </Text>
    <Button
      type="submit"
      size="sm"
      aria-label={isSignup ? ARIA_SUBMIT_SIGNUP : ARIA_SUBMIT_LOGIN}
      radius="md"
    >
      {isSignup ? TEXT_SIGNUP : TEXT_LOGIN}
    </Button>
  </Group>
);
