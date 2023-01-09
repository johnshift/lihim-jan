import * as NextImage from 'next/image';
import { ImageProps } from 'next/image';
import React, { ReactNode } from 'react';

import { Center } from '@mantine/core';

import { useDarkMode } from 'storybook-dark-mode';

import { MantineProvider } from '@lihim/shared/mantine';

// NextJS parse image fix
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => <OriginalNextImage {...props} unoptimized />,
});

// Mantine - Storybook theme
const ThemeWrapper = (props: { children: ReactNode }) => (
  <MantineProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
    <Center style={{ width: '100vw', height: '100vh' }}>
      {props.children}
    </Center>
  </MantineProvider>
);

// Global exports
// export const parameters = { layout: 'fullscreen' };
export const decorators = [
  // eslint-disable-next-line @typescript-eslint/ban-types
  (renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
];