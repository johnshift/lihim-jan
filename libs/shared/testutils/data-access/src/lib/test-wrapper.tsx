import { ReactNode } from 'react';

import { QueryClient } from '@tanstack/react-query';

import { ReactQueryProvider } from '@lihim/shared/react-query';
import { TestWrapper as UiTestWrapper } from '@lihim/shared/testutils/ui';

interface Props {
  children: ReactNode;

  // Optional to include ui wrapper (defaults to false)
  withUiProvider?: boolean;
}

const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env['NODE_ENV'] === 'test' ? () => ({}) : console.error,
  },
  defaultOptions: {
    queries: {
      // All request become stale immediately
      staleTime: 0,
      // Turn retries off
      retry: false,
      // Do not cache result
      cacheTime: 0,
    },
    mutations: {
      // Turn retries off
      retry: false,
    },
  },
});

// Test Wrapper which contains mantine and react-query wrapper providers
export const TestWrapper = ({ children, withUiProvider = false }: Props) =>
  withUiProvider ? (
    <UiTestWrapper>
      <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
    </UiTestWrapper>
  ) : (
    <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
  );
