import { QueryClientConfig } from '@tanstack/react-query';

export const defaultQueryClientOptions: QueryClientConfig['defaultOptions'] = {
  queries: {
    staleTime: 1 * 10_000,
    retry: 1,
  },
};
