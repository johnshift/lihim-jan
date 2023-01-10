import { rest } from 'msw';

import { authUrls, LoginResponse } from '@lihim/auth/core';
import { GenericResponse } from '@lihim/shared/core';

type Options = {
  body?: LoginResponse | GenericResponse;
  status?: number;
  delay?: number;
  networkError?: boolean;
};

export const mockLoginResponse = (options: Options) =>
  rest.post(authUrls.login, (_req, res, ctx) =>
    options.networkError
      ? res.networkError('err-network')
      : res(
          ctx.status(options.status ?? 200),
          ctx.json(options.body),
          ctx.delay(options.delay),
        ),
  );
