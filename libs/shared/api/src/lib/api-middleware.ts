import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ApiError,
  ERR_CONSOLE_CAUGHT_INTERNAL,
  ERR_INTERNAL,
  GenericResponse,
  METHOD_GET,
  METHOD_POST,
} from '@lihim/shared/core';

import { checkMethod } from './check-method';

type Options = {
  method: typeof METHOD_GET | typeof METHOD_POST;
};

export const apiMiddleware = <Data>(
  handler: NextApiHandler<Data | GenericResponse>,
  options: Options,
) =>
  async function (
    req: NextApiRequest,
    res: NextApiResponse<Data | GenericResponse>,
  ) {
    try {
      checkMethod(options.method, req.method);

      await handler(req, res);
    } catch (error) {
      // Throw api error
      if (error instanceof ApiError) {
        return res.status(error.status).json(error.jsonBody());
      }

      // Defaults to internal error
      console.error(ERR_CONSOLE_CAUGHT_INTERNAL, (error as Error).message);
      return res.status(500).json({ message: ERR_INTERNAL });
    }
  };
