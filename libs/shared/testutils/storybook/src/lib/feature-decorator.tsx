import { FC, ReactNode } from 'react';

import { Center } from '@mantine/core';

import { useDarkMode } from 'storybook-dark-mode';

import { RootProvider } from '@lihim/shared/data-access';
import { MantineProvider } from '@lihim/shared/mantine';
import { TestWrapper as DataTestWrapper } from '@lihim/shared/testutils/data-access';

type Props = {
  children: ReactNode;
};

export const FeatureDecorator: FC<Props> = ({ children }) => (
  <MantineProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
    <DataTestWrapper>
      <RootProvider>
        <Center>{children}</Center>
      </RootProvider>
    </DataTestWrapper>
  </MantineProvider>
);
