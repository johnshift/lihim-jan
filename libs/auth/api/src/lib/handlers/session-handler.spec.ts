/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as jwtDecodeModule from 'jwt-decode';
import { createMocks } from 'node-mocks-http';

import { fakeSession } from '@lihim/auth/testutils';
import { MockApiRequest, MockApiResponse } from '@lihim/shared/api';
import * as sharedApi from '@lihim/shared/api';
import { ERR_METHOD, METHOD_GET, METHOD_POST } from '@lihim/shared/core';

import { COOKEY_CSRF, COOKEY_SESSION } from '../constants';
import * as sessionCipherModule from '../utils/session-cipher';
import { encryptSessionCookie } from '../utils/session-cipher';

import { sessionHandler } from './session-handler';

jest.mock('../utils/session-cipher', () => ({
  __esModule: true,
  ...jest.requireActual('../utils/session-cipher'),
}));

jest.mock('jwt-decode', () => ({
  __esModule: true,
  ...jest.requireActual('jwt-decode'),
}));

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('sessionHandler', () => {
  // Test vars
  const errmsg = 'Test error message';
  const session = fakeSession();
  const accessToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJzdWIiOiIiLCJhdWQiOiIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImlhdCI6MTY1NjQ3NDQzNSwiZXhwIjoxOTgyNTYxOTA3fQ.5wcsLwirYWiNJaTRwzSRjlUbn5Pp0nhETuUVdSh2g4c';
  const [sessionToken, csrfToken] = encryptSessionCookie(accessToken, session);

  test('method not allowed', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_POST,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(405);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      message: ERR_METHOD,
    });
  });

  test('no session cookie', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: undefined as unknown as string,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('no csrf cookie', async () => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: undefined as unknown as string,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('csrf token mismatch', async () => {
    // Mock decrypt returns mismatched csrf
    jest
      .spyOn(sessionCipherModule, 'decryptSessionCookie')
      .mockReturnValueOnce([accessToken, session, 'mismatch-csrf']);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('jwt-decode error', async () => {
    // Mock jwt-decode error
    jest.spyOn(jwtDecodeModule, 'default').mockImplementationOnce(() => {
      throw new Error(errmsg);
    });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('expired access-token', async () => {
    // Mock jwt-decode returns expired token
    jest.spyOn(jwtDecodeModule, 'default').mockReturnValueOnce({
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1hr before
      role: 'authenticated',
    });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('unauthenticated access-token', async () => {
    // Mock jwt-decode returns expired token
    jest.spyOn(jwtDecodeModule, 'default').mockReturnValueOnce({
      exp: Math.floor(Date.now() / 1000) + 3600, // Valid for 1hr
      role: 'not-authenticated',
    });

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('supabase getSession error', async () => {
    // Mock getSession error
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValueOnce({
          data: { session: null },
          error: { message: errmsg },
        }),
      },
    } as any);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('supabase getSession no access-token returned', async () => {
    // Mock getSession no access token
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValueOnce({
          data: { session: null },
          error: null,
        }),
      },
    } as any);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      isAnon: true,
    });
  });

  test('success response', async () => {
    // Mock getSession success
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValueOnce({
          data: { session: { access_token: 'fake-new-token' } },
          error: null,
        }),
      },
    } as any);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      method: METHOD_GET,
      cookies: {
        [COOKEY_SESSION]: sessionToken,
        [COOKEY_CSRF]: csrfToken,
      },
    });

    // Exec handler
    await sessionHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      ...session,
    });
  });
});
