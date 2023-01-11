import type { FC } from 'react';
import type { Control } from 'react-hook-form';

import { Group, Stack, Title } from '@mantine/core';

import type { SignupPayload } from '@lihim/auth/core';
import { NAME_PASSWORD, TESTID_SIGNUP_LOADING } from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

import { credentialInputs, nameInputs } from './constants';
import { FormFooter } from './form-footer';
import { FormWrapper } from './form-wrapper';

type Props = {
  isLoading: boolean;
  control: Control<SignupPayload>;
  showLogin: TVoidFn;
  onSubmit: TVoidFn;
  errors?: Record<keyof SignupPayload, string | boolean>;
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
  <FormWrapper
    isLoading={isLoading}
    loadingTestId={TESTID_SIGNUP_LOADING}
    onSubmit={onSubmit}
  >
    <Stack sx={{ width: '36ch' }} spacing={20}>
      <Title order={1}>Sign Up</Title>
      <Group>
        {nameInputs.map((inputProps) => (
          <ValidatedInput
            key={inputProps.name}
            sx={{ width: '17ch' }}
            control={control}
            error={errors[inputProps.name]}
            inputProps={{ ...inputProps }}
          />
        ))}
      </Group>
      {credentialInputs.map((inputProps) => (
        <ValidatedInput
          key={inputProps.name}
          control={control}
          error={errors[inputProps.name]}
          inputProps={{ ...inputProps }}
          isPassword={inputProps.name === NAME_PASSWORD}
        />
      ))}
      <FormFooter isSignup onClick={showLogin} />
    </Stack>
  </FormWrapper>
);
