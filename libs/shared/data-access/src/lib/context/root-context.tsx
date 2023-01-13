import type { ReactNode } from 'react';
import { createContext, useMemo, useState } from 'react';

import type { Session } from '@lihim/auth/core';
import { AuthModalState } from '@lihim/auth/core';
import type { ObjectValues, TVoidFn } from '@lihim/shared/core';

import { useSession } from '../hooks/use-session';

type TAuthModalState = ObjectValues<typeof AuthModalState>;

type AuthModalActions = {
  close: TVoidFn;
  openLogin: TVoidFn;
  openLogout: TVoidFn;
  openSignup: TVoidFn;
};

type RootContext = {
  isLoading: boolean;
  session: Session;
  authModalState: TAuthModalState;
  authModalActions: AuthModalActions;
};

export const RootCtx = createContext<RootContext>({
  isLoading: false,
  session: { isAnon: true },
  authModalState: AuthModalState.Closed,
  authModalActions: {
    close: () => null,
    openLogin: () => null,
    openLogout: () => null,
    openSignup: () => null,
  },
});

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, isFetching, data: session } = useSession();

  const [authModalState, setAuthModalState] = useState<TAuthModalState>(
    AuthModalState.Closed,
  );
  const closeAuthModal = () => setAuthModalState(AuthModalState.Closed);
  const openLogin = () => setAuthModalState(AuthModalState.Login);
  const openLogout = () => setAuthModalState(AuthModalState.Logout);
  const openSignup = () => setAuthModalState(AuthModalState.Signup);

  const memoed = useMemo(
    () => ({
      isLoading: isLoading || isFetching,
      session: session ?? { isAnon: true },
      authModalState,
      authModalActions: {
        close: closeAuthModal,
        openLogin,
        openLogout,
        openSignup,
      },
    }),
    [authModalState, isFetching, isLoading, session],
  );

  return <RootCtx.Provider value={memoed}>{children}</RootCtx.Provider>;
};
