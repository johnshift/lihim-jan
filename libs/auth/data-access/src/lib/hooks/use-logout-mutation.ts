import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_URL_LOGOUT, authErrMsg, authMsg } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';
import { GenericResponseSchema, METHOD_POST } from '@lihim/shared/core';
import { apiFetch } from '@lihim/shared/data-access';
import { useNotify } from '@lihim/shared/utils';

const logoutMutation = apiFetch<GenericResponse>(API_URL_LOGOUT, {
  method: METHOD_POST,
  responseSchema: GenericResponseSchema,
});

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  const { notifyLoading, notifySuccess, notifyError } = useNotify();

  return useMutation<GenericResponse, GenericResponse>(() => logoutMutation(), {
    onMutate() {
      // Show loading notification
      notifyLoading(authMsg.logoutLoading);
    },
    onSuccess() {
      // Update session query data
      queryClient.setQueryData(['session'], {
        isAnon: true,
      });

      // Display success message
      notifySuccess(authMsg.logoutOk, authMsg.logoutDone);
    },
    onError(error) {
      // Display error message
      notifyError(authErrMsg.logoutFailed, error.message);
    },
  });
};
