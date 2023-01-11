import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

import { Session } from '@lihim/auth/core';
import { AuthModalState } from '@lihim/auth/core';
import { ObjectValues } from '@lihim/shared/core';

import { useSession } from '../hooks/use-session';

type TAuthModalState = ObjectValues<typeof AuthModalState>;

type RootContext = {
  isLoading: boolean;
  session: Session;
  authModalState: TAuthModalState;
  setAuthModalState: Dispatch<SetStateAction<TAuthModalState>>;
};

export const RootCtx = createContext<RootContext>({
  isLoading: false,
  session: { isAnon: true },
  authModalState: AuthModalState.Closed,
  setAuthModalState: () => null,
});

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, isFetching, data: session } = useSession();

  const [authModalState, setAuthModalState] = useState<TAuthModalState>(
    AuthModalState.Closed,
  );

  const memoed = useMemo(
    () => ({
      isLoading: isLoading || isFetching,
      session: session ?? { isAnon: true },
      authModalState,
      setAuthModalState,
    }),
    [authModalState, isFetching, isLoading, session],
  );

  return <RootCtx.Provider value={memoed}>{children}</RootCtx.Provider>;
};
