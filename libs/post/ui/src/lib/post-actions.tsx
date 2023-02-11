import { FC, ReactNode } from 'react';

import { Box, Group } from '@mantine/core';

type Props = {
  // Pass feature components as props to remain stateless ui
  heart: ReactNode;
  reactionPicker: ReactNode;
};

export const PostActions: FC<Props> = ({ heart, reactionPicker }) => (
  <Group sx={{ justifyContent: 'space-between' }}>
    <Box sx={{ minWidth: '30%' }} mt={-5}>
      {heart}
    </Box>
    <Box
      sx={{
        display: 'flex',
        minWidth: '30%',
        justifyContent: 'end',
      }}
    >
      {reactionPicker}
    </Box>
  </Group>
);
