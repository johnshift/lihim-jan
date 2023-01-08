import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { defaultQueryClientOptions } from './default-query-client-options';

const defaultQueryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions,
});

type Props = {
  children: ReactNode;
  client?: QueryClient;

  // Devtools is only available in web
  isWeb?: boolean;
};

export const ReactQueryProvider = ({
  children,
  client = defaultQueryClient,
  isWeb = true,
}: Props) => (
  <QueryClientProvider client={client}>
    {children}
    {isWeb && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
