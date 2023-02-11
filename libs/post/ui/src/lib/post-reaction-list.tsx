import { FC, ReactNode } from 'react';

import { Divider, SimpleGrid } from '@mantine/core';

type Props = {
  children: ReactNode;
};

export const PostReactionList: FC<Props> = ({ children }) => (
  <>
    <Divider my={10} />
    <SimpleGrid cols={5} p={10}>
      {children}
    </SimpleGrid>
    <Divider my={10} />
  </>
);
