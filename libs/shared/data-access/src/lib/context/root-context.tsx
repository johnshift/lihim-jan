import { createContext, ReactNode, useMemo } from 'react';

import { Session } from '@lihim/auth/core';

import { useSession } from '../hooks/use-session';

type RootContext = {
  isLoading: boolean;
  session: Session;
};

export const RootCtx = createContext<RootContext>({
  isLoading: false,
  session: { isAnon: true },
});

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, isFetching, data: session } = useSession();

  const memoed = useMemo(
    () => ({
      isLoading: isLoading || isFetching,
      session: session ?? { isAnon: true },
    }),
    [isFetching, isLoading, session],
  );

  return <RootCtx.Provider value={memoed}>{children}</RootCtx.Provider>;
};
