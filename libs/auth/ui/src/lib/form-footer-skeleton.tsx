import { Group, Skeleton } from '@mantine/core';

export const FormFooterSkeleton = () => (
  <Group position="apart">
    <Skeleton height={23} width={145} />
    <Skeleton height={35} width={80} radius="md" />
  </Group>
);
