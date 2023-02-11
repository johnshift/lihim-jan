import { FC } from 'react';

import { Box, Title } from '@mantine/core';

type Props = {
  title: string;
};

export const PostTitle: FC<Props> = ({ title }) => (
  <Box>
    <Title order={3}>{title}</Title>
  </Box>
);
