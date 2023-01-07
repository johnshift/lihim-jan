import { z } from 'zod';

import { GenericResponse, METHOD_GET, METHOD_POST } from '@lihim/shared/core';

/**
 * Response returned by `apiFetch` which contains a `message` field
 */
export type ErrorResponse = Record<string, unknown> & GenericResponse;

/**
 * Function signature returned by the `apiFetch` util.
 *
 * Contains payload which represents either `GET params` or `POST req.body`
 */
export type FetchFn<R, P> = (_payload?: P) => Promise<R>;

/**
 * Options type for `apiFetch` util
 */
export type ApiFetchOptions<R, E, P> = {
  method: typeof METHOD_GET | typeof METHOD_POST;
  responseSchema: z.ZodType<R>;
  errorSchema?: z.ZodType<E>;
  payloadSchema?: z.ZodType<P>;
};
