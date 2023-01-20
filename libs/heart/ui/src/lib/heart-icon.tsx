import { FC, ReactNode } from 'react';

import { Box } from '@mantine/core';

type Props = {
  icon: ReactNode;
};

/**
 * HeartIcon needs to be 'absolute' because we adjust its position to match the container.
 * Its sibling element offsets the icon size to look like they are next to each other.
 */
export const HeartIcon: FC<Props> = ({ icon }) => (
  <Box sx={{ position: 'absolute', top: -33, left: -25 }}>{icon}</Box>
);
