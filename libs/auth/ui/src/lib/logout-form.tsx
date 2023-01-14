import type { FC, FormEventHandler } from 'react';

import { Button, Flex, Group, Stack, Title } from '@mantine/core';

import {
  TESTID_LOGOUT_LOADING,
  TEXT_LOGOUT,
  TEXT_LOGOUT_SUBTITLE,
  TEXT_LOGOUT_TITLE,
} from '@lihim/auth/core';
import { TEXT_CANCEL, TVoidFn } from '@lihim/shared/core';

import { FormWrapper } from './form-wrapper';

type Props = {
  isLoading: boolean;
  onCancel: TVoidFn;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const LogoutForm: FC<Props> = ({ isLoading, onCancel, onSubmit }) => (
  <FormWrapper
    isLoading={isLoading}
    loadingTestId={TESTID_LOGOUT_LOADING}
    onSubmit={onSubmit}
  >
    <Stack sx={{ width: 350 }}>
      <Title order={2}>{TEXT_LOGOUT_TITLE}</Title>
      <Title order={5} color="dimmed" size="sm">
        {TEXT_LOGOUT_SUBTITLE}
      </Title>
      <Flex justify="end" mt={20}>
        <Group>
          <Button color="gray" variant="outline" onClick={onCancel}>
            {TEXT_CANCEL}
          </Button>
          <Button type="submit" color="red" variant="outline">
            {TEXT_LOGOUT}
          </Button>
        </Group>
      </Flex>
    </Stack>
  </FormWrapper>
);
