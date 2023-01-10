import { useForm } from 'react-hook-form';

import { aria, testid } from '@lihim/shared/core';
import { render, renderHook, screen, user } from '@lihim/shared/testutils/ui';

import { ValidatedInput } from './validated-input';

describe('ValidatedInput', () => {
  // Test constants
  const {
    result: {
      current: { control },
    },
  } = renderHook(() => useForm());
  const testInputProps = {
    name: 'test-name',
    label: 'test-label',
    placeholder: 'test-placeholder',
    defaultValue: 'test-default-value',
  };
  const error = 'test-error';

  test('text-input defaults', () => {
    // Render component
    render(<ValidatedInput control={control} inputProps={testInputProps} />);

    // Locate input element
    const inputElement = screen.getByPlaceholderText(
      testInputProps.placeholder,
    );

    // Assertions
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('aria-invalid', 'false');
    expect(inputElement).toHaveAttribute('name', testInputProps.name);
    expect(inputElement).toHaveAttribute(
      'placeholder',
      testInputProps.placeholder,
    );
    expect(inputElement).toHaveValue(testInputProps.defaultValue);
    expect(screen.getByText(testInputProps.label)).toBeInTheDocument();
  });

  test('password-input defaults', () => {
    // Render component
    render(
      <ValidatedInput
        isPassword
        control={control}
        inputProps={testInputProps}
      />,
    );

    // Locate input element
    const inputElement = screen.getByPlaceholderText(
      testInputProps.placeholder,
    );

    // Assertions
    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement.parentElement).toHaveAttribute('aria-invalid', 'false');
    expect(inputElement).toHaveAttribute('name', testInputProps.name);
    expect(inputElement).toHaveAttribute(
      'placeholder',
      testInputProps.placeholder,
    );
    expect(inputElement).toHaveValue(testInputProps.defaultValue);
    expect(screen.getByText(testInputProps.label)).toBeInTheDocument();
  });

  test('text-input error', () => {
    // Render component
    render(
      <ValidatedInput
        control={control}
        inputProps={testInputProps}
        error={error}
      />,
    );

    // Locate input element
    const inputElement = screen.getByPlaceholderText(
      testInputProps.placeholder,
    );

    // Assertions
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(error)).toBeVisible();
  });

  test('password-input error', () => {
    // Render component
    render(
      <ValidatedInput
        isPassword
        control={control}
        inputProps={testInputProps}
        error={error}
      />,
    );

    // Locate input element
    const inputElement = screen.getByPlaceholderText(
      testInputProps.placeholder,
    );

    // Assertions
    expect(inputElement.parentElement).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(error)).toBeVisible();
  });

  test('toggle password visibility', async () => {
    // Render component
    render(
      <ValidatedInput
        isPassword
        control={control}
        inputProps={testInputProps}
      />,
    );

    // Locate elements
    const inputElement = screen.getByPlaceholderText(
      testInputProps.placeholder,
    );
    const toggleVisibility = screen.getByTestId(testid.passwordVisibility);

    // Toggle to visible text then assert
    await user.click(toggleVisibility);
    expect(inputElement).toHaveAttribute('type', 'text');
    await screen.findByText(aria.hidePasswordIcon);

    // Toggle to hidden then assert
    await user.click(toggleVisibility);
    expect(inputElement).toHaveAttribute('type', 'password');
    await screen.findByText(aria.showPasswordIcon);
  });
});
