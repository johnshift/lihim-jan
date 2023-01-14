import { FormEventHandler } from 'react';

import { useLogoutMutation } from '@lihim/auth/data-access';
import { LogoutForm as LogoutFormUi } from '@lihim/auth/ui';
import { useRootContext } from '@lihim/shared/data-access';

const LogoutForm = () => {
  // Auth modal state
  const { authModalActions } = useRootContext();

  // Logout mutation
  const { isLoading, mutate } = useLogoutMutation();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <LogoutFormUi
      isLoading={isLoading}
      onCancel={authModalActions.close}
      onSubmit={onSubmit}
    />
  );
};

export default LogoutForm;
