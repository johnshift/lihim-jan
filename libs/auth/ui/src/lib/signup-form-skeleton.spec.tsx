import { TESTID_SIGNUP_SKELETON } from '@lihim/auth/core';
import { render, screen } from '@lihim/shared/testutils/ui';

import { SignupFormSkeleton } from './signup-form-skeleton';

describe('SignupFormSkeleton', () => {
  test('render ok', () => {
    render(<SignupFormSkeleton />);
    expect(screen.getByTestId(TESTID_SIGNUP_SKELETON)).toBeVisible();
  });
});
