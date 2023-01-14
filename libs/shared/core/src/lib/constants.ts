// String literals
export const METHOD_GET = 'GET';
export const METHOD_POST = 'POST';
export const TEXT_BRAND = 'lihim';
export const TEXT_LOADING = 'Loading';
export const TEXT_CANCEL = 'Cancel';

// Http Errors
export const ERR_INTERNAL = 'Something went wrong :(';
export const ERR_NETWORK = 'Network request failed';
export const ERR_METHOD = 'Method not allowed';
export const ERR_INVALID_REQUEST = 'Invalid request data';
export const ERR_INVALID_RESPONSE = 'Invalid response data';
export const ERR_OFFLINE = 'No internet connection';
export const ERR_CONSOLE_CAUGHT_INTERNAL = 'Caught internal error:';

// Error suffix
export const ERR_SUFFIX_REQUIRED = 'is required';
export const ERR_SUFFIX_SHORT = 'is too short';
export const ERR_SUFFIX_LONG = 'is too long';
export const ERR_SUFFIX_INVALID = 'is invalid';
export type ErrSuffix =
  | typeof ERR_SUFFIX_REQUIRED
  | typeof ERR_SUFFIX_SHORT
  | typeof ERR_SUFFIX_LONG
  | typeof ERR_SUFFIX_INVALID;

// Attributes
export const ARIA_SHOW_PASSWORD_ICON = 'show password icon';
export const ARIA_HIDE_PASSWORD_ICON = 'hide password icon';
export const TESTID_PASSWORD_VISIBILITY = 'password-visibility';
export const TESTID_NAV_AUTH_ACTION = 'nav-auth-action';
