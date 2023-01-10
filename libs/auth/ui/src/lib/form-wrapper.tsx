import { FC, ReactNode } from 'react';

import { Center, LoadingOverlay, Paper } from '@mantine/core';

import { TVoidFn } from '@lihim/shared/core';

type Props = {
  children: ReactNode;
  onSubmit: TVoidFn;
  isLoading: boolean;
  loadingTestId: string;
};

export const FormWrapper: FC<Props> = ({
  children,
  isLoading,
  onSubmit,
  loadingTestId,
}) => (
  <Paper
    withBorder
    sx={{ minWidth: 320, position: 'relative' }}
    py={20}
    px={40}
    radius="lg"
  >
    <LoadingOverlay visible={isLoading} data-testid={loadingTestId} />
    <form onSubmit={onSubmit}>
      <Center>{children}</Center>
    </form>
  </Paper>
);
