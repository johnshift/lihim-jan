import type { GenericResponse, Undefined } from '@lihim/shared/core';
import { httpErrors, UndefinedSchema } from '@lihim/shared/core';
import { parseObject } from '@lihim/shared/utils';

import { FetchError } from './constants';
import { getParsedError } from './get-parsed-error';
import { getUrlBody } from './get-url-body';
import type { ApiFetchOptions, FetchFn } from './types';

const invalidRequestError = new FetchError({
  message: httpErrors.invalidRequest,
});
const invalidResponseError = new FetchError({
  message: httpErrors.invalidResponse,
});

export const apiFetch =
  <R, E = GenericResponse, P = Undefined>(
    reqUrl: string,
    options: ApiFetchOptions<R, E, P>,
  ): FetchFn<R, P> =>
  async (_payload?: P) => {
    const { method, payloadSchema, responseSchema, errorSchema } = options;

    try {
      const payload = parseObject(
        _payload,
        invalidRequestError,
        payloadSchema ?? UndefinedSchema,
      );

      const { url, body } = getUrlBody(reqUrl, method, payload);

      const res = await fetch(url, { method, body });
      const jsonBody = await res.json();

      if (!res.ok) {
        throw new FetchError(jsonBody);
      }

      return parseObject(jsonBody, invalidResponseError, responseSchema);
    } catch (error) {
      const parsedError = getParsedError<E>(error, errorSchema);
      throw parsedError;
    }
  };
