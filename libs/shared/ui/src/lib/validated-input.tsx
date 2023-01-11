import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { PasswordInput, Sx, TextInput } from '@mantine/core';
import { BiHide, BiShow } from 'react-icons/bi';

import {
  ARIA_HIDE_PASSWORD_ICON,
  ARIA_SHOW_PASSWORD_ICON,
  TESTID_PASSWORD_VISIBILITY,
} from '@lihim/shared/core';

type InputProps<T extends FieldValues> = {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  inputProps: InputProps<T>;
  isPassword?: boolean;
  error?: string | boolean;
  sx?: Sx;
};

export const ValidatedInput = <T extends FieldValues>(props: Props<T>) => {
  const { control, inputProps, isPassword = false, error = false, sx } = props;

  return (
    <Controller
      defaultValue={
        inputProps.defaultValue ?? ('' as FieldPathValue<T, FieldPath<T>>)
      }
      name={inputProps.name as FieldPath<T>}
      control={control}
      render={({ field }) =>
        isPassword ? (
          <PasswordInput
            required
            label={inputProps.label}
            placeholder={inputProps.placeholder}
            error={error}
            sx={sx}
            visibilityToggleIcon={({ reveal, size }) => (
              <div data-testid={TESTID_PASSWORD_VISIBILITY}>
                {reveal ? (
                  <BiHide size={size} title={ARIA_HIDE_PASSWORD_ICON} />
                ) : (
                  <BiShow size={size} title={ARIA_SHOW_PASSWORD_ICON} />
                )}
              </div>
            )}
            {...field}
          />
        ) : (
          <TextInput
            required
            label={inputProps.label}
            placeholder={inputProps.placeholder}
            error={error}
            sx={sx}
            {...field}
          />
        )
      }
    />
  );
};
