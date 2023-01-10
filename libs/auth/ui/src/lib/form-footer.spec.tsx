import { authAria, authTestId, authTexts } from '@lihim/auth/core';
import { render, screen, user } from '@lihim/shared/testutils/ui';

import { FormFooter } from './form-footer';

describe('FormFooter', () => {
  test('isSignup omitted', async () => {
    // Render component
    render(<FormFooter onClick={jest.fn()} />);

    // Locate elements
    const link = screen.getByTestId(authTestId.loginFooterLink);
    const text = screen.getByText(authTexts.loginFooter);
    const btn = screen.getByRole('button', { name: authAria.submitLogin });

    // Assertions
    expect(link).toBeVisible();
    expect(text).toBeVisible();
    expect(btn).toBeVisible();
    expect(btn).toHaveTextContent(authTexts.login);
  });

  test('isSignup = true', async () => {
    // Render component
    render(<FormFooter isSignup onClick={jest.fn()} />);

    // Locate elements
    const link = screen.getByTestId(authTestId.signupFooterLink);
    const text = screen.getByText(authTexts.signupFooter);
    const btn = screen.getByRole('button', { name: authAria.submitSignup });

    // Assertions
    expect(link).toBeVisible();
    expect(text).toBeVisible();
    expect(btn).toBeVisible();
    expect(btn).toHaveTextContent(authTexts.signup);
  });

  test('onClick called', async () => {
    // Render component
    const onClick = jest.fn();
    render(<FormFooter onClick={onClick} />);

    // Locate element
    const link = screen.getByTestId(authTestId.loginFooterLink);

    // Click link
    await user.click(link);

    // Assert called
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
