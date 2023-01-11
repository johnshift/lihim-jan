import { rest } from 'msw';

import type { SignupErrorResponse, SignupResponse } from '@lihim/auth/core';
import { API_URL_SIGNUP } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';

type Options = {
  body?: SignupResponse | SignupErrorResponse | GenericResponse;
  status?: number;
  delay?: number;
  networkError?: boolean;
};

export const mockSignupResponse = (options: Options) =>
  rest.post(API_URL_SIGNUP, (_req, res, ctx) =>
    options.networkError
      ? res.networkError('err-network')
      : res(
          ctx.status(options.status ?? 200),
          ctx.json(options.body),
          ctx.delay(options.delay),
        ),
  );
