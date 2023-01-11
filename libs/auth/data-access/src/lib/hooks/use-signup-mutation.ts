import { useRouter } from 'next/router';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  SignupErrorResponse,
  SignupPayload,
  SignupResponse,
} from '@lihim/auth/core';
import {
  API_URL_SIGNUP,
  authErrMsg,
  MSG_SIGNUP_OK,
  SignupErrorResponseSchema,
  SignupPayloadSchema,
  SignupResponseSchema,
} from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { METHOD_POST } from '@lihim/shared/core';
import { apiFetch } from '@lihim/shared/data-access';
import { useNotify } from '@lihim/shared/utils';

const signupMutation = apiFetch<
  SignupResponse,
  SignupErrorResponse,
  SignupPayload
>(API_URL_SIGNUP, {
  method: METHOD_POST,
  responseSchema: SignupResponseSchema,
  errorSchema: SignupErrorResponseSchema,
  payloadSchema: SignupPayloadSchema,
});

export const useSignupMutation = (closeModal: TVoidFn) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotify();

  return useMutation<SignupResponse, SignupErrorResponse, SignupPayload>(
    (payload: SignupPayload) => signupMutation(payload),
    {
      async onSuccess(data) {
        // Update session query data
        queryClient.setQueryData(['session'], {
          ...data.session,
        });

        // Close signup modal
        closeModal();

        // Redirect to homepage
        await router.push('/');

        // Display success message
        notifySuccess(MSG_SIGNUP_OK, data.message);
      },
      onError(error) {
        // Display error message
        notifyError(authErrMsg.signupFailed, error.message);
      },
    },
  );
};
