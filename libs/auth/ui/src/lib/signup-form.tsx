import type { FC } from 'react';
import type { Control } from 'react-hook-form';

import { Group, Stack, Title } from '@mantine/core';

import type { SignupPayload } from '@lihim/auth/core';
import { authInputProps, authTestId } from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

import { FormFooter } from './form-footer';
import { FormWrapper } from './form-wrapper';

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

type NameInputProps = {
  control: Control<SignupPayload>;
  error: string | boolean;
  isLastname?: boolean;
};

const NameInput: FC<NameInputProps> = ({ control, error, isLastname }) => (
  <ValidatedInput
    sx={{ width: '17ch' }}
    control={control}
    error={error}
    inputProps={isLastname ? authInputProps.lastname : authInputProps.firstname}
  />
);

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
    loadingTestId={authTestId.signupLoadingOverlay}
    onSubmit={onSubmit}
  >
    <Stack sx={{ width: '36ch' }} spacing={20}>
      <Title order={1}>Sign Up</Title>
      <Group>
        <NameInput control={control} error={errors.firstname} />
        <NameInput isLastname control={control} error={errors.lastname} />
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
      <FormFooter isSignup onClick={showLogin} />
    </Stack>
  </FormWrapper>
);
