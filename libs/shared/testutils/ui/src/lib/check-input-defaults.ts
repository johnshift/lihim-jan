/* eslint-disable testing-library/no-node-access */

import { screen, waitFor } from '@testing-library/react';

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
      options.name === 'password' ? input.parentElement : input,
    ).toHaveAttribute('aria-invalid', options.invalid ?? 'false');
  });
  expect(input).toHaveAttribute('name', options.name);
  expect(input).toHaveAttribute('placeholder', options.placeholder);
  expect(screen.getByText(options.label)).toBeVisible();
};
