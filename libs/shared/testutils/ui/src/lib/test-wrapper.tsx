import { ReactNode } from 'react';

import { MantineProvider } from '@lihim/shared/mantine';

interface Props {
  children: ReactNode;
}
// Test Wrapper which contains mantine and react-query wrapper providers
export const TestWrapper = ({ children }: Props) => (
  <MantineProvider>{children}</MantineProvider>
);
