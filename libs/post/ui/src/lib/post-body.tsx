import { FC } from 'react';

import { Box, Text } from '@mantine/core';

type Props = {
  body: string;
};

export const PostBody: FC<Props> = ({ body }) => (
  <Box>
    <Text>{body}</Text>
  </Box>
);
