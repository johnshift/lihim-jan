import { rest } from 'msw';

import { API_URL_LOGOUT } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';

type Options = {
  body?: GenericResponse;
  status?: number;
  delay?: number;
  networkError?: boolean;
};

export const mockLogoutResponse = (options: Options) =>
  rest.post(API_URL_LOGOUT, (_req, res, ctx) =>
    options.networkError
      ? res.networkError('err-network')
      : res(
          ctx.status(options.status ?? 200),
          ctx.json(options.body),
          ctx.delay(options.delay),
        ),
  );
