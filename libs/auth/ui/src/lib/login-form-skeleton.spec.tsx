import { TESTID_LOGIN_SKELETON } from '@lihim/auth/core';
import { render, screen } from '@lihim/shared/testutils/ui';

import { LoginFormSkeleton } from './login-form-skeleton';

describe('LoginFormSkeleton', () => {
  test('render ok', () => {
    render(<LoginFormSkeleton />);
    expect(screen.getByTestId(TESTID_LOGIN_SKELETON));
  });
});
