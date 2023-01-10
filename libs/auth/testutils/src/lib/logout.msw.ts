import { rest } from 'msw';

import { authUrls } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';

type Options = {
  body?: GenericResponse;
  status?: number;
  delay?: number;
  networkError?: boolean;
};

export const mockLogoutResponse = (options: Options) =>
  rest.post(authUrls.logout, (_req, res, ctx) =>
    options.networkError
      ? res.networkError('err-network')
      : res(
          ctx.status(options.status ?? 200),
          ctx.json(options.body),
          ctx.delay(options.delay),
        ),
  );
