import { rest } from 'msw';

import type { LoginResponse } from '@lihim/auth/core';
import { API_URL_LOGIN } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';

type Options = {
  body?: LoginResponse | GenericResponse;
  status?: number;
  delay?: number;
  networkError?: boolean;
};

export const mockLoginResponse = (options: Options) =>
  rest.post(API_URL_LOGIN, (_req, res, ctx) =>
    options.networkError
      ? res.networkError('err-network')
      : res(
          ctx.status(options.status ?? 200),
          ctx.json(options.body),
          ctx.delay(options.delay),
        ),
  );
