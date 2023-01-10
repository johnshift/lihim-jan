import { FC } from 'react';
import type { Control } from 'react-hook-form';

import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {
  authAria,
  authInputProps,
  authTestId,
  authTexts,
  LoginPayload,
} from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

type Props = {
  isLoading: boolean;
  hasError: boolean;
  onSubmit: TVoidFn;
  showSignup: TVoidFn;
  control: Control<LoginPayload>;
};

export const LoginForm: FC<Props> = ({
  isLoading,
  hasError,
  onSubmit,
  showSignup,
  control,
}) => (
  <Paper
    withBorder
    sx={{ minWidth: 320, position: 'relative' }}
    py={20}
    px={35}
    radius="lg"
  >
    <LoadingOverlay
      visible={isLoading}
      data-testid={authTestId.loginLoadingOverlay}
    />
    <form onSubmit={onSubmit}>
      <Center>
        <Stack sx={{ width: '32ch' }} spacing={20}>
          <Title order={1}>Login</Title>
          <ValidatedInput
            control={control}
            error={hasError}
            inputProps={authInputProps.principal}
          />
          <ValidatedInput
            isPassword
            control={control}
            error={hasError}
            inputProps={authInputProps.password}
          />
          <Group position="apart">
            <Text
              color="dimmed"
              size="sm"
              sx={(theme) => ({
                '&:hover': { color: theme.colors.blue[4], cursor: 'pointer' },
              })}
              data-testid={authTestId.loginFooterLink}
              onClick={showSignup}
            >
              {authTexts.loginFooter}
            </Text>
            <Button
              type="submit"
              size="sm"
              aria-label={authAria.submitLogin}
              radius="md"
            >
              {authTexts.login}
            </Button>
          </Group>
        </Stack>
      </Center>
    </form>
  </Paper>
);
