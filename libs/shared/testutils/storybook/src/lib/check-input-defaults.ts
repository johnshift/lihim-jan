import { expect } from '@storybook/jest';
import { screen, waitFor } from '@storybook/testing-library';

type CheckOptions = {
  name: string;
  placeholder: string;
  label: string;
  value?: string;
  invalid?: string;
  type?: string;
};

export const checkInputDefaults = async (
  input: HTMLElement,
  options: CheckOptions,
) => {
  expect(input).toHaveValue(options.value ?? '');
  expect(input).toHaveAttribute('type', options.type ?? 'text');
  await waitFor(() => {
    expect(
      // eslint-disable-next-line testing-library/no-node-access
      options.name === 'password' ? input.parentElement : input,
    ).toHaveAttribute('aria-invalid', options.invalid ?? 'false');
  });
  expect(input).toHaveAttribute('name', options.name);
  expect(input).toHaveAttribute('placeholder', options.placeholder);
  expect(screen.getByText(options.label)).toBeVisible();
};
