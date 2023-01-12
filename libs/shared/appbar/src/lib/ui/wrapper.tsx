import { ReactNode } from 'react';

import { Box, Paper } from '@mantine/core';

type Props = {
  children: ReactNode;
};

export const Wrapper = ({ children }: Props) => (
  <Box sx={{ position: 'sticky', top: 0, width: '100%', zIndex: 3 }}>
    <Paper p={15} shadow="sm">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {children}
      </Box>
    </Paper>
  </Box>
);
