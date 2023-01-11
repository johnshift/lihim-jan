import { Center, Group, Skeleton, Stack, Title } from '@mantine/core';

import { TESTID_LOGIN_SKELETON } from '@lihim/auth/core';

import { FormPaper } from './form-wrapper';

export const LoginFormSkeleton = () => (
  <FormPaper>
    <Center data-testid={TESTID_LOGIN_SKELETON}>
      <Stack sx={{ width: '32ch' }} spacing={25}>
        <Title order={1}>Login</Title>
        <Skeleton height={45} radius="md" mt={10} />
        <Skeleton height={45} radius="md" mt={10} />
        <Group position="apart">
          <Skeleton height={23} width={140} />
          <Skeleton height={35} width={80} radius="md" />
        </Group>
      </Stack>
    </Center>
  </FormPaper>
);
