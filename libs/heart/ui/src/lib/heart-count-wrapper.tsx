import { FC, ReactNode } from 'react';

import { Box, Center, Loader } from '@mantine/core';

type Props = {
  isLoading: boolean;
  onClick: VoidFunction;
  children: ReactNode;
};

const HeartLoader = () => (
  <Loader size={18} variant="dots" color="red" data-testid="hearts-loader" />
);

/**
 * HeartCountWrapper is the child sibling of HeartIcon.
 * It holds the onClick handler, and disable clicks when loading.
 * It displays the loader and counter.
 */
export const HeartCountWrapper: FC<Props> = ({
  isLoading,
  onClick,
  children,
}) => (
  <Box
    py={3}
    px={10}
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      cursor: 'pointer',
      minWidth: 80,
      pointerEvents: isLoading ? 'none' : undefined,
    }}
    onClick={onClick}
  >
    {/* Offset heart-icon */}
    <Box sx={{ minWidth: 30 }} />
    <Box ml={8}>
      <Center sx={{ height: 30 }}>
        {isLoading ? <HeartLoader /> : children}
      </Center>
    </Box>
  </Box>
);
