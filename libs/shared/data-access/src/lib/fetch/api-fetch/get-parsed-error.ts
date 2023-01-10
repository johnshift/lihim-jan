import { z } from 'zod';

import {
  ERR_INTERNAL,
  ERR_OFFLINE,
  GenericResponse,
  GenericResponseSchema,
} from '@lihim/shared/core';

import { FetchError } from './constants';

export const getParsedError = <E>(
  error: unknown,
  errorSchema?: z.ZodType<E>,
): Error | GenericResponse | E => {
  if (!navigator.onLine) {
    return new Error(ERR_OFFLINE);
  }

  if (error instanceof FetchError) {
    const schema = errorSchema ?? GenericResponseSchema;
    const parsedError = schema.safeParse(error.body);

    if (!parsedError.success) {
      return new Error(ERR_INTERNAL);
    }

    return parsedError.data;
  }

  return new Error(ERR_INTERNAL);
};
