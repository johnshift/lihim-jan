import { ObjectValues } from './types';

export const httpErrors = {
  internal: 'Something went wrong :(',
  network: 'Network request failed',
  method: 'Method not allowed',
  invalidRequest: 'Invalid request data',
  invalidResponse: 'Invalid response data',
  offline: 'No internet connection',
} as const;

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
