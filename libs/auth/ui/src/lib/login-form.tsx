import { FC } from 'react';
import type { Control } from 'react-hook-form';

import { Stack, Title } from '@mantine/core';

import { loginInputs, LoginPayload } from '@lihim/auth/core';
import { NAME_PASSWORD, TESTID_LOGIN_LOADING } from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

import { FormFooter } from './form-footer';
import { FormWrapper } from './form-wrapper';

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
  <FormWrapper
    isLoading={isLoading}
    loadingTestId={TESTID_LOGIN_LOADING}
    onSubmit={onSubmit}
  >
    <Stack sx={{ width: '32ch' }} spacing={20}>
      <Title order={1}>Login</Title>

      {loginInputs.map((inputProps) => (
        <ValidatedInput
          key={inputProps.name}
          control={control}
          error={hasError}
          inputProps={{ ...inputProps }}
          isPassword={inputProps.name === NAME_PASSWORD}
        />
      ))}

      <FormFooter onClick={showSignup} />
    </Stack>
  </FormWrapper>
);
