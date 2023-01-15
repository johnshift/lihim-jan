import { createMocks } from 'node-mocks-http';

import { MSG_LOGOUT_DONE } from '@lihim/auth/core';
import { MockApiRequest, MockApiResponse } from '@lihim/shared/api';
import {
  ERR_CONSOLE_CAUGHT_INTERNAL,
  ERR_INTERNAL,
  ERR_METHOD,
  METHOD_GET,
  METHOD_POST,
} from '@lihim/shared/core';

import * as dbLogoutModule from '../rpcs/db-logout';

import { logoutHandler } from './logout-handler';

jest.mock('../rpcs/db-logout', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/db-logout'),
}));

describe('logoutHandler', () => {
  test('method not allowed', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET, // Invalid method
    });

    // Exec handler
    await logoutHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(405);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_METHOD });
  });

  test('supabase signout error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock dbLogout error
    const errmsg = 'Test error message';
    jest.spyOn(dbLogoutModule, 'dbLogout').mockRejectedValue(new Error(errmsg));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_POST,
    });

    // Exec handler
    await logoutHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      errmsg,
    );
  });

  test('success', async () => {
    // Mock dbLogout success
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(dbLogoutModule, 'dbLogout').mockImplementation(async () => {});

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_POST,
    });

    // Exec handler
    await logoutHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: MSG_LOGOUT_DONE });
  });
});
