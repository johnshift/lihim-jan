import type { FC } from 'react';
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

import type { SignupPayload } from '@lihim/auth/core';
import {
  authAria,
  authInputProps,
  authTestId,
  authTexts,
} from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

type Props = {
  isLoading: boolean;
  control: Control<SignupPayload>;
  showLogin: TVoidFn;
  onSubmit: TVoidFn;
  errors?: {
    firstname: string | boolean;
    lastname: string | boolean;
    username: string | boolean;
    email: string | boolean;
    password: string | boolean;
  };
};

export const SignupForm: FC<Props> = ({
  isLoading,
  onSubmit,
  control,
  errors = {
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
  },
  showLogin,
}) => (
  <Paper
    withBorder
    sx={{ minWidth: 320, position: 'relative' }}
    py={20}
    px={45}
    radius="lg"
  >
    <LoadingOverlay
      visible={isLoading}
      data-testid={authTestId.signupLoadingOverlay}
    />
    <form onSubmit={onSubmit}>
      <Center>
        <Stack sx={{ width: '36ch' }} spacing={20}>
          <Title order={1}>Sign Up</Title>
          <Group>
            <ValidatedInput
              sx={{ width: '17ch' }}
              control={control}
              error={errors.firstname}
              inputProps={authInputProps.firstname}
            />
            <ValidatedInput
              sx={{ width: '17ch' }}
              control={control}
              error={errors.lastname}
              inputProps={authInputProps.lastname}
            />
          </Group>
          <ValidatedInput
            control={control}
            error={errors.username}
            inputProps={authInputProps.username}
          />
          <ValidatedInput
            control={control}
            error={errors.email}
            inputProps={authInputProps.email}
          />
          <ValidatedInput
            isPassword
            control={control}
            error={errors.password}
            inputProps={authInputProps.password}
          />
          <Group position="apart">
            <Text
              color="dimmed"
              size="sm"
              sx={(theme) => ({
                '&:hover': { color: theme.colors.blue[4], cursor: 'pointer' },
              })}
              data-testid={authTestId.signupFooterLink}
              onClick={showLogin}
            >
              {authTexts.signupFooter}
            </Text>
            <Button
              type="submit"
              size="sm"
              aria-label={authAria.submitSignup}
              radius="md"
            >
              {authTexts.signup}
            </Button>
          </Group>
        </Stack>
      </Center>
    </form>
  </Paper>
);
