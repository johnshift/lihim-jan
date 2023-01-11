import { Center, Group, Skeleton, Stack, Title } from '@mantine/core';

import { TESTID_SIGNUP_SKELETON } from '@lihim/auth/core';

import { FormPaper } from './form-wrapper';

export const SignupFormSkeleton = () => (
  <FormPaper>
    <Center data-testid={TESTID_SIGNUP_SKELETON}>
      <Stack sx={{ width: '36ch' }} spacing={33}>
        <Title order={1}>Sign Up</Title>
        <Group position="apart">
          <Skeleton height={45} radius="md" width="45%" />
          <Skeleton height={45} radius="md" width="45%" />
        </Group>
        <Skeleton height={45} radius="md" />
        <Skeleton height={45} radius="md" />
        <Skeleton height={45} radius="md" />
        <Group position="apart">
          <Skeleton height={23} width={145} />
          <Skeleton height={35} width={80} radius="md" />
        </Group>
      </Stack>
    </Center>
  </FormPaper>
);
