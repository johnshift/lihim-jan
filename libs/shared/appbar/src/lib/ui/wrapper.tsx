import { ReactNode } from 'react';

import { Center, Paper } from '@mantine/core';

type Props = {
  children: ReactNode;
};

export const Wrapper = ({ children }: Props) => (
  <Paper
    p={15}
    shadow="md"
    sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}
  >
    <Center>
      <Center
        sx={(theme) => ({
          justifyContent: 'space-between',
          width: '95%',
          [theme.fn.largerThan(550)]: {
            width: '85%',
          },
          [theme.fn.largerThan(750)]: {
            width: '95%',
            maxWidth: 750,
          },
          [theme.fn.largerThan(1024)]: {
            width: '95%',
            maxWidth: 1024,
          },
        })}
      >
        {children}
      </Center>
    </Center>
  </Paper>
);
