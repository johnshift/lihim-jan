import type { StaticImageData } from 'next/image';
import type { FC } from 'react';

import { useEmojiLoading } from '../hooks/use-emoji-loading';

import { EmojiImage } from './emoji-image';

export type EmojiComponentProps = {
  src: StaticImageData;
  placeholder: StaticImageData;
  alt: string;
};

// Type EmojiComponentProps = typeof emojiProps[number];

export const EmojiComponent: FC<EmojiComponentProps> = ({
  src,
  placeholder,
  alt,
}) => {
  const { loading, done } = useEmojiLoading();

  return (
    <EmojiImage
      alt={alt}
      src={src}
      placeholder={placeholder}
      isLoading={loading}
      onLoadingComplete={done}
    />
  );
};
