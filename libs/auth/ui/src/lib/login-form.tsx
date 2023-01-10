import { FC } from 'react';
import type { Control } from 'react-hook-form';

import {
  Anchor,
  Box,
  Button,
  Center,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from '@mantine/core';

import {
  authAria,
  authLabels,
  authPlaceholders,
  authTestId,
  authTexts,
  LoginPayload,
} from '@lihim/auth/core';
import { authNames } from '@lihim/auth/core';
import type { TVoidFn } from '@lihim/shared/core';
import { ValidatedInput } from '@lihim/shared/ui';

type Props = {
  isLoading: boolean;
  hasError: boolean;
  onSubmit: TVoidFn;
  showSignup: TVoidFn;
  control: Control<LoginPayload>;
};

export const LoginForm: FC<Props> = ({
  isLoading,
  hasError,
  onSubmit,
  showSignup,
  control,
}) => (
  <Box sx={{ minWidth: 320, position: 'relative' }} py={10}>
    <LoadingOverlay
      visible={isLoading}
      data-testid={authTestId.loginLoadingOverlay}
    />
    <form onSubmit={onSubmit}>
      <Center>
        <Stack spacing="xl" sx={{ width: '28ch' }}>
          <ValidatedInput
            control={control}
            error={hasError}
            inputProps={{
              name: authNames.principal,
              label: authLabels.principal,
              placeholder: authPlaceholders.principal,
            }}
          />
          <ValidatedInput
            isPassword
            control={control}
            error={hasError}
            inputProps={{
              name: authNames.password,
              label: authLabels.password,
              placeholder: authPlaceholders.password,
            }}
          />
          <Button type="submit" size="sm" aria-label={authAria.submitLogin}>
            {authTexts.login}
          </Button>
          <Group align="center" position="center" spacing={6}>
            <Text color="dimmed" size="sm">
              {authTexts.loginFooter}
            </Text>
            <Anchor
              component="button"
              underline={false}
              size={15}
              data-testid={authTestId.loginFooterLink}
              onClick={showSignup}
            >
              {authTexts.signup}
            </Anchor>
          </Group>
        </Stack>
      </Center>
    </form>
  </Box>
);
