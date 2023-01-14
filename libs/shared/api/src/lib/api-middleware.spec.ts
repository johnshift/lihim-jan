import type { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';

import {
  ApiError,
  ERR_CONSOLE_CAUGHT_INTERNAL,
  ERR_INTERNAL,
  ERR_METHOD,
  METHOD_GET,
  METHOD_POST,
} from '@lihim/shared/core';

import { apiMiddleware } from './api-middleware';
import type { MockApiRequest, MockApiResponse } from './types';

// Success handler
const MSG_SUCCESS = 'OK';
const successHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: MSG_SUCCESS });
};

// Api error handler
const STATUS_API_ERROR = 401;
const MSG_API_ERROR = 'Api Error';
const apiErrorHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  throw new ApiError(STATUS_API_ERROR, MSG_API_ERROR);
};

// Internal error handler
const MSG_INTERNAL_ERROR = 'Some internal error';
const internalErrorHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  throw new Error(MSG_INTERNAL_ERROR);
};

describe('apiMiddleware', () => {
  test('invalid method', async () => {
    // Wrap test-handler with api-middleware
    const handler = apiMiddleware(successHandler, { method: METHOD_GET });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_POST, // Invalid method
    });

    // Handle request
    await handler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(405);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_METHOD });
  });

  test('api error', async () => {
    // Wrap test-handler with api-middleware
    const handler = apiMiddleware(apiErrorHandler, { method: METHOD_GET });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET, // Valid method
    });

    // Handle request
    await handler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(STATUS_API_ERROR);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: MSG_API_ERROR });
  });

  test('internal error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Wrap test-handler with api-middleware
    const handler = apiMiddleware(internalErrorHandler, { method: METHOD_GET });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET, // Valid method
    });

    // Handle request
    await handler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      MSG_INTERNAL_ERROR,
    );
  });

  test('success', async () => {
    // Wrap test-handler with api-middleware
    const handler = apiMiddleware(successHandler, { method: METHOD_GET });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET, // Valid method
    });

    // Handle request
    await handler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: MSG_SUCCESS });
  });
});
