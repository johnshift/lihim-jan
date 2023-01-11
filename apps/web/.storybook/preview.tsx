import * as NextImage from 'next/image';
import { ImageProps } from 'next/image';
import React from 'react';

// NextJS parse image fix
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => <OriginalNextImage {...props} unoptimized />,
});
