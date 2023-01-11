import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import type { SignupPayload } from '@lihim/auth/core';
import { SignupPayloadSchema } from '@lihim/auth/core';
import { AuthModalState } from '@lihim/auth/core';
import { useSignupMutation } from '@lihim/auth/data-access';
import { SignupForm as SignupFormUi } from '@lihim/auth/ui';
import { useRootContext } from '@lihim/shared/data-access';

export const SignupForm = () => {
  // Auth modal state
  const { setAuthModalState } = useRootContext();
  const closeAuthModal = () => setAuthModalState(AuthModalState.Closed);
  const showLogin = () => setAuthModalState(AuthModalState.Login);

  // Signin mutation
  const { mutate, error, isLoading } = useSignupMutation(closeAuthModal);

  // Form controls
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPayload>({
    resolver: zodResolver(SignupPayloadSchema),
  });

  const submit: SubmitHandler<SignupPayload> = (data) => mutate(data);

  return (
    <SignupFormUi
      isLoading={isLoading}
      control={control}
      showLogin={showLogin}
      errors={{
        firstname: Boolean(
          error?.field === 'firstname' || errors.firstname?.message,
        ),
        lastname: Boolean(
          error?.field === 'lastname' || errors.lastname?.message,
        ),
        username:
          error?.field === 'username'
            ? error.message
            : Boolean(errors.username?.message),
        email:
          error?.field === 'email'
            ? error.message
            : Boolean(errors.email?.message),
        password:
          error?.field === 'password'
            ? error.message
            : Boolean(errors.password?.message),
      }}
      onSubmit={handleSubmit(submit)}
    />
  );
};
