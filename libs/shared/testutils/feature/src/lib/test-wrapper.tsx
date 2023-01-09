import { ReactNode } from 'react';

import { RootProvider } from '@lihim/shared/data-access';
import { TestWrapper as DataTestWrapper } from '@lihim/shared/testutils/data-access';

type Props = {
  children: ReactNode;
};

export const TestWrapper = (props: Props) => (
  <DataTestWrapper withUiProvider>
    <RootProvider>{props.children}</RootProvider>
  </DataTestWrapper>
);
