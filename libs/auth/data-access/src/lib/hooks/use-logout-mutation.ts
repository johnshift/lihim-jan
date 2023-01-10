import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authErrMsg, authMsg, authUrls } from '@lihim/auth/core';
import {
  GenericResponse,
  GenericResponseSchema,
  METHOD_POST,
} from '@lihim/shared/core';
import { apiFetch } from '@lihim/shared/data-access';
import { useNotify } from '@lihim/shared/utils';

const logoutMutation = apiFetch<GenericResponse>(authUrls.logout, {
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
