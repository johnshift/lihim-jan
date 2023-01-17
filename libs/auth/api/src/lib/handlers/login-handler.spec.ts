import { createMocks, RequestOptions } from 'node-mocks-http';
import { uid } from 'uid';

import {
  ERR_LOGIN_INCORRECT,
  LoggedInSession,
  MSG_LOGIN_OK_INFO,
} from '@lihim/auth/core';
import { fakeLoginPayload, fakeSession } from '@lihim/auth/testutils';
import { MockApiRequest, MockApiResponse } from '@lihim/shared/api';
import {
  ERR_CONSOLE_CAUGHT_INTERNAL,
  ERR_INTERNAL,
  ERR_METHOD,
  METHOD_GET,
  METHOD_POST,
} from '@lihim/shared/core';

import * as dbLoginModule from '../rpcs/db-login';
import * as getEmailModule from '../rpcs/get-email';
import * as getSessionInfoModule from '../rpcs/get-session-info';
import * as setSessionCookieModule from '../utils/set-session-cookie';

import { loginHandler } from './login-handler';

jest.mock('../rpcs/get-email', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/get-email'),
}));

jest.mock('../rpcs/db-login', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/db-login'),
}));

jest.mock('../rpcs/get-session-info', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/get-session-info'),
}));

jest.mock('../utils/set-session-cookie', () => ({
  __esModule: true,
  ...jest.requireActual('../utils/set-session-cookie'),
}));

describe('loginHandler', () => {
  // Mocked vars
  const payload = fakeLoginPayload();
  const accessToken = uid();
  const session = fakeSession() as LoggedInSession;
  const ERR_INTERNAL_RPC = 'Some internal error during rpc ...';

  test('method not allowed', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_GET,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(405);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_METHOD });
  });

  test('non-json payload', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: '{"message":"test-message"',
    } as unknown as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(400);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_LOGIN_INCORRECT });
  });

  test('failed validation', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: {
        principal: 'demo!',
        password: '1234',
      },
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(400);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_LOGIN_INCORRECT });
  });

  test('getEmail error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock getEmail error
    jest
      .spyOn(getEmailModule, 'getEmail')
      .mockRejectedValueOnce(new Error(ERR_INTERNAL_RPC));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      ERR_INTERNAL_RPC,
    );
  });

  test('supabase login error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock getEmail success
    jest
      .spyOn(getEmailModule, 'getEmail')
      .mockResolvedValueOnce(payload.principal);

    // Mock supabase login internal error
    jest
      .spyOn(dbLoginModule, 'dbLogin')
      .mockRejectedValueOnce(new Error(ERR_INTERNAL_RPC));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      ERR_INTERNAL_RPC,
    );
  });

  test('getSessionInfo error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock getEmail success
    jest
      .spyOn(getEmailModule, 'getEmail')
      .mockResolvedValueOnce(payload.principal);

    // Mock supabase success
    jest.spyOn(dbLoginModule, 'dbLogin').mockResolvedValueOnce(accessToken);

    // Mock get-session-info internal error
    jest
      .spyOn(getSessionInfoModule, 'getSessionInfo')
      .mockRejectedValueOnce(new Error(ERR_INTERNAL_RPC));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      ERR_INTERNAL_RPC,
    );
  });

  test('setSessionCookie error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock getEmail success
    jest
      .spyOn(getEmailModule, 'getEmail')
      .mockResolvedValueOnce(payload.principal);

    // Mock supabase success
    jest.spyOn(dbLoginModule, 'dbLogin').mockResolvedValueOnce(accessToken);

    // Mock get-session-info success
    jest
      .spyOn(getSessionInfoModule, 'getSessionInfo')
      .mockResolvedValueOnce(session);

    // Mock set-session-cookie internal error
    jest
      .spyOn(setSessionCookieModule, 'setSessionCookie')
      .mockImplementationOnce(() => {
        throw new Error(ERR_INTERNAL_RPC);
      });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      ERR_CONSOLE_CAUGHT_INTERNAL,
      ERR_INTERNAL_RPC,
    );
  });

  test('success', async () => {
    // Mock getEmail success
    jest
      .spyOn(getEmailModule, 'getEmail')
      .mockResolvedValueOnce(payload.principal);

    // Mock supabase success
    jest.spyOn(dbLoginModule, 'dbLogin').mockResolvedValueOnce(accessToken);

    // Mock get-session-info success
    jest
      .spyOn(getSessionInfoModule, 'getSessionInfo')
      .mockResolvedValueOnce(session);

    // Mock set-session-cookie success
    jest
      .spyOn(setSessionCookieModule, 'setSessionCookie')
      .mockImplementationOnce(() => null);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    await loginHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      message: MSG_LOGIN_OK_INFO,
      session,
    });
  });
});
