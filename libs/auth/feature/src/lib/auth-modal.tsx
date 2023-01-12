import dynamic from 'next/dynamic';

import { Modal } from '@mantine/core';

import { AuthModalState } from '@lihim/auth/core';
import { LoginFormSkeleton, SignupFormSkeleton } from '@lihim/auth/ui';
import { useRootContext } from '@lihim/shared/data-access';

const LoginForm = dynamic(() => import('./login-form'), {
  loading: () => <LoginFormSkeleton />,
});

const SignupForm = dynamic(() => import('./signup-form'), {
  loading: () => <SignupFormSkeleton />,
});

export const AuthModal = () => {
  const { authModalState, setAuthModalState } = useRootContext();
  const closeAuthModal = () => setAuthModalState(AuthModalState.Closed);

  return (
    <Modal
      centered
      withCloseButton={false}
      opened={authModalState !== AuthModalState.Closed}
      size="auto"
      radius="lg"
      onClose={closeAuthModal}
    >
      {authModalState === AuthModalState.Login && <LoginForm />}
      {authModalState === AuthModalState.Signup && <SignupForm />}
    </Modal>
  );
};
