import { FC, ReactNode } from 'react';

import { Center } from '@mantine/core';

import { useDarkMode } from 'storybook-dark-mode';

import { MantineProvider } from '@lihim/shared/mantine';

type Props = {
  children: ReactNode;
};

export const UiDecorator: FC<Props> = ({ children }) => (
  <MantineProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
    <Center style={{ width: '100vw', height: '100vh' }}>{children}</Center>
  </MantineProvider>
);
