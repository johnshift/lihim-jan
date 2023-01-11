import * as NextImage from 'next/image';
import { ImageProps } from 'next/image';
import React from 'react';

import { initialize, mswDecorator } from 'msw-storybook-addon';

// NextJS parse image fix
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => <OriginalNextImage {...props} unoptimized />,
});

// Initialize msw
initialize({
  onUnhandledRequest({ method, url }) {
    if (url.pathname.startsWith('/api')) {
      console.error(`Unhandled ${method} request to "${url}"`);
    }
  },
});

// Global exports
export const decorators = [mswDecorator];
