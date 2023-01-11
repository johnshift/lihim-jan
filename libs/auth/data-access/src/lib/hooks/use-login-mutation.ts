import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { LoginPayload, LoginResponse } from '@lihim/auth/core';
import {
  API_URL_LOGIN,
  authErrMsg,
  LoginPayloadSchema,
  LoginResponseSchema,
  MSG_LOGIN_OK,
} from '@lihim/auth/core';
import type { GenericResponse, TVoidFn } from '@lihim/shared/core';
import { ERR_INVALID_REQUEST, METHOD_POST } from '@lihim/shared/core';
import { apiFetch } from '@lihim/shared/data-access';
import { useNotify } from '@lihim/shared/utils';

const loginMutation = apiFetch<LoginResponse, GenericResponse, LoginPayload>(
  API_URL_LOGIN,
  {
    method: METHOD_POST,
    responseSchema: LoginResponseSchema,
    payloadSchema: LoginPayloadSchema,
  },
);

export const useLoginMutation = (closeModal: TVoidFn) => {
  const queryClient = useQueryClient();

  const { notifySuccess, notifyError } = useNotify();

  return useMutation<LoginResponse, GenericResponse, LoginPayload>(
    (payload: LoginPayload) => loginMutation(payload),
    {
      onSuccess(data) {
        // Update session query data
        queryClient.setQueryData(['session'], {
          ...data.session,
        });

        // Close signin modal
        closeModal();

        // Display success message
        notifySuccess(MSG_LOGIN_OK, data.message);
      },
      onError(error) {
        // Display error message
        // If failed to parse zod-schema, incorrect signin
        const errMsg =
          error.message === ERR_INVALID_REQUEST
            ? authErrMsg.loginIncorrect
            : error.message;
        notifyError(authErrMsg.loginFailed, errMsg);
      },
    },
  );
};
