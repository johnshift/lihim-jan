import NextImage, { ImageProps } from 'next/image';
import { FC } from 'react';

import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  outer: {
    position: 'relative',
    minWidth: 26,
    minHeight: 26,
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export type EmojiImageProps = {
  alt: string;
  src: ImageProps['src'];
  placeholder: ImageProps['src'];
  isLoading: boolean;
  onLoadingComplete?: ImageProps['onLoadingComplete'];
};

// EmojiImage is the nextjs image-optimization reusable component
export const EmojiImage: FC<EmojiImageProps> = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.inner}>
        <NextImage
          height={32}
          width={32}
          src={props.isLoading ? props.placeholder : props.src}
          alt={props.alt}
          priority={props.isLoading}
          onLoadingComplete={props.onLoadingComplete}
        />
      </div>
    </div>
  );
};
