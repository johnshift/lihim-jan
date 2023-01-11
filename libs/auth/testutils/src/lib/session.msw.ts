import { rest } from 'msw';

import type { Session } from '@lihim/auth/core';
import { API_URL_SESSION } from '@lihim/auth/core';
import { GenericResponse } from '@lihim/shared/core';

export const mockSessionResponse = (
  status: number,
  body: Session | GenericResponse,
  delay = 0,
) =>
  rest.get(API_URL_SESSION, (_req, res, ctx) =>
    res(ctx.status(status), ctx.json(body), ctx.delay(delay)),
  );
