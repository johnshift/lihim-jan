import { FC } from 'react';

import { Group, Text } from '@mantine/core';

import { timeSince } from '@lihim/shared/utils';

type Props = {
  username: string;
  created: Date | string;
};

export const PostHeader: FC<Props> = ({ username, created }) => (
  <Group spacing="xs">
    <Text size="xs" c="dimmed">
      Posted by
    </Text>
    <Text size="sm" fw={700} ml={-5}>
      {username}
    </Text>
    <Text size="xs" c="dimmed">
      {timeSince(created)}
    </Text>
  </Group>
);
