import { FC, FormEventHandler, ReactNode } from 'react';

import { Box, Center, LoadingOverlay } from '@mantine/core';

import { TVoidFn } from '@lihim/shared/core';

type Props = {
  children: ReactNode;
  onSubmit: TVoidFn | FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  loadingTestId: string;
};

export const FormPaper: FC<{ children: ReactNode }> = ({ children }) => (
  <Box sx={{ minWidth: 320, position: 'relative' }} py={20} px={40}>
    {children}
  </Box>
);

export const FormWrapper: FC<Props> = ({
  children,
  isLoading,
  onSubmit,
  loadingTestId,
}) => (
  <FormPaper>
    <LoadingOverlay visible={isLoading} data-testid={loadingTestId} />
    <form onSubmit={onSubmit}>
      <Center>{children}</Center>
    </form>
  </FormPaper>
);
