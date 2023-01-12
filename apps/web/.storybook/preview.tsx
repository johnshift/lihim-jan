import { RouterContext } from 'next/dist/shared/lib/router-context';
import * as NextImage from 'next/image';
import { ImageProps } from 'next/image';
import React, { ReactNode } from 'react';

import { Center } from '@mantine/core';

import { WithNextRouter } from 'storybook-addon-next-router/dist/decorators';
import { useDarkMode } from 'storybook-dark-mode';

import { QueryClient } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import { mockSessionResponse } from '@lihim/auth/testutils';
import { RootProvider } from '@lihim/shared/data-access';
import { MantineProvider } from '@lihim/shared/mantine';
import { ReactQueryProvider } from '@lihim/shared/react-query';

// React query client
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

// Initialize msw
initialize({
  onUnhandledRequest({ method, url }) {
    if (url.pathname.startsWith('/api')) {
      console.error(`Unhandled ${method} request to "${url}"`);
    }
  },
});

// NextJS parse image fix
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => <OriginalNextImage {...props} unoptimized />,
});

// Mantine - Storybook theme
const ThemeWrapper = (props: { children: ReactNode }) => (
  <MantineProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
    <ReactQueryProvider client={queryClient}>
      <RootProvider>
        <Center>{props.children}</Center>
      </RootProvider>
    </ReactQueryProvider>
  </MantineProvider>
);

// Global exports
export const parameters = {
  darkMode: {
    current: 'dark', // Enforce dark theme on initial load
  },
  msw: {
    handlers: [mockSessionResponse(200, { isAnon: true })],
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
export const decorators = [
  // eslint-disable-next-line @typescript-eslint/ban-types
  (renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
  mswDecorator,
  WithNextRouter,
];
