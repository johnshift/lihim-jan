import { rest } from 'msw';

import { authUrls, Session } from '@lihim/auth/core';
import { GenericResponse } from '@lihim/shared/core';

export const mockSessionResponse = (
  status: number,
  body: Session | GenericResponse,
  delay = 0,
) =>
  rest.get(authUrls.session, (_req, res, ctx) =>
    res(ctx.status(status), ctx.json(body), ctx.delay(delay)),
  );
