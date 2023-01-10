import { ObjectValues } from './types';

export const errSuffix = {
  required: 'is required',
  short: 'is too short',
  long: 'is too short',
  invalid: 'is invalid',
} as const;

export const texts = {
  brand: 'lihim',
  loading: 'Loading',
} as const;

export type ErrSuffix = ObjectValues<typeof errSuffix>;

export const aria = {
  showPasswordIcon: 'show password icon',
  hidePasswordIcon: 'hide password icon',
};

export const testid = {
  passwordVisibility: 'password-visibility',
};
