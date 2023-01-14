import {
  ApiError,
  ERR_METHOD,
  METHOD_GET,
  METHOD_POST,
} from '@lihim/shared/core';

/**
 * `checkMethod` ensures http request method is correct
 * @param method expected method
 * @param requestMethod actual method from request using `req.method`
 */
export const checkMethod = (
  method: typeof METHOD_GET | typeof METHOD_POST,
  requestMethod: string | undefined,
) => {
  if (method !== requestMethod) {
    throw new ApiError(405, ERR_METHOD);
  }
};
