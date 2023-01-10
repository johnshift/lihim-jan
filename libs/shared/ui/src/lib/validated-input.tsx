import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { PasswordInput, TextInput } from '@mantine/core';
import { BiHide, BiShow } from 'react-icons/bi';

import { aria, testid } from '@lihim/shared/core';

type InputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  inputProps: InputProps<T>;
  isPassword?: boolean;
  error?: string | boolean;
};

export const ValidatedInput = <T extends FieldValues>(props: Props<T>) => {
  const { control, inputProps, isPassword = false, error = false } = props;

  return (
    <Controller
      defaultValue={
        inputProps.defaultValue ?? ('' as FieldPathValue<T, FieldPath<T>>)
      }
      name={inputProps.name}
      control={control}
      render={({ field }) =>
        isPassword ? (
          <PasswordInput
            required
            label={inputProps.label}
            placeholder={inputProps.placeholder}
            error={error}
            visibilityToggleIcon={({ reveal, size }) => (
              <div data-testid={testid.passwordVisibility}>
                {reveal ? (
                  <BiHide size={size} title={aria.hidePasswordIcon} />
                ) : (
                  <BiShow size={size} title={aria.showPasswordIcon} />
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
            {...field}
          />
        )
      }
    />
  );
};
