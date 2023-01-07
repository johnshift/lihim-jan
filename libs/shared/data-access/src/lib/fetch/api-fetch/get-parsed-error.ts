import { z } from 'zod';

import {
  GenericResponse,
  GenericResponseSchema,
  httpErrors,
} from '@lihim/shared/core';

import { FetchError } from './constants';

export const getParsedError = <E>(
  error: unknown,
  errorSchema?: z.ZodType<E>,
): Error | GenericResponse | E => {
  if (!navigator.onLine) {
    return new Error(httpErrors.offline);
  }

  if (error instanceof FetchError) {
    const schema = errorSchema ?? GenericResponseSchema;
    const parsedError = schema.safeParse(error.body);

    if (!parsedError.success) {
      return new Error(httpErrors.internal);
    }

    return parsedError.data;
  }

  return new Error(httpErrors.internal);
};
