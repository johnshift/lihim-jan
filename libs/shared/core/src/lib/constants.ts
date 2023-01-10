// String literals
export const METHOD_GET = 'GET';
export const METHOD_POST = 'POST';

// Http Errors
export const ERR_INTERNAL = 'Something went wrong :(';
export const ERR_NETWORK = 'Network request failed';
export const ERR_METHOD = 'Method not allowed';
export const ERR_INVALID_REQUEST = 'Invalid request data';
export const ERR_INVALID_RESPONSE = 'Invalid response data';
export const ERR_OFFLINE = 'No internet connection';

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
