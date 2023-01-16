import { waitFor } from '@testing-library/react';

import { createMocks, RequestOptions } from 'node-mocks-http';

import {
  LABEL_EMAIL,
  LABEL_FIRSTNAME,
  LABEL_LASTNAME,
  LABEL_PASSWORD,
  LABEL_USERNAME,
  Session,
} from '@lihim/auth/core';
import { fakeSignupPayload } from '@lihim/auth/testutils';
import { MockApiRequest, MockApiResponse } from '@lihim/shared/api';
import {
  ERR_CONSOLE_CAUGHT_INTERNAL,
  ERR_INTERNAL,
  ERR_SUFFIX_INVALID,
  ERR_SUFFIX_LONG,
  ERR_SUFFIX_REQUIRED,
  ERR_SUFFIX_SHORT,
  errPhrase,
  METHOD_POST,
} from '@lihim/shared/core';

import * as dbSignupModule from '../rpcs/db-signup';
import * as signupPreflightModule from '../rpcs/signup-preflight';

import { signupHandler } from './signup-handler';

jest.mock('../rpcs/signup-preflight', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/signup-preflight'),
}));

jest.mock('../rpcs/db-signup', () => ({
  __esModule: true,
  ...jest.requireActual('../rpcs/db-signup'),
}));

describe('signupHandler', () => {
  // Test vars
  const payload = fakeSignupPayload();
  const session: Session = {
    ...payload,
    bio: 'fake-bio',
    avatar: 'fake-avatar',
    isAnon: false,
    id: 'fake-id',
  };
  const accessToken = 'fake-token';

  test.each([
    [
      'required',
      'firstname',
      undefined,
      errPhrase(LABEL_FIRSTNAME, ERR_SUFFIX_REQUIRED),
    ],
    ['short', 'firstname', 'x', errPhrase(LABEL_FIRSTNAME, ERR_SUFFIX_SHORT)],
    [
      'long',
      'firstname',
      'asdfasdfasdfasdfasdfasdfasdfasdfx',
      errPhrase(LABEL_FIRSTNAME, ERR_SUFFIX_LONG),
    ],
    [
      'invalid',
      'firstname',
      'name!',
      errPhrase(LABEL_FIRSTNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'invalid type',
      'firstname',
      { msg: 'im-invalid' },
      errPhrase(LABEL_FIRSTNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'required',
      'lastname',
      undefined,
      errPhrase(LABEL_LASTNAME, ERR_SUFFIX_REQUIRED),
    ],
    ['short', 'lastname', 'x', errPhrase(LABEL_LASTNAME, ERR_SUFFIX_SHORT)],
    [
      'long',
      'lastname',
      'asdfasdfasdfasdfasdfasdfasdfasdfx',
      errPhrase(LABEL_LASTNAME, ERR_SUFFIX_LONG),
    ],
    [
      'invalid',
      'lastname',
      'name!',
      errPhrase(LABEL_LASTNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'invalid type',
      'lastname',
      { msg: 'im-invalid' },
      errPhrase(LABEL_LASTNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'required',
      'username',
      undefined,
      errPhrase(LABEL_USERNAME, ERR_SUFFIX_REQUIRED),
    ],
    ['short', 'username', 'xxx', errPhrase(LABEL_USERNAME, ERR_SUFFIX_SHORT)],
    [
      'long',
      'username',
      'asdfasdfasdfasdfasdfasdfasdfasdfx',
      errPhrase(LABEL_USERNAME, ERR_SUFFIX_LONG),
    ],
    [
      'invalid',
      'username',
      'demo!',
      errPhrase(LABEL_USERNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'invalid type',
      'username',
      { msg: 'im-invalid' },
      errPhrase(LABEL_USERNAME, ERR_SUFFIX_INVALID),
    ],
    [
      'required',
      'email',
      undefined,
      errPhrase(LABEL_EMAIL, ERR_SUFFIX_REQUIRED),
    ],
    ['invalid', 'email', 'demo', errPhrase(LABEL_EMAIL, ERR_SUFFIX_INVALID)],
    [
      'invalid type',
      'email',
      { msg: 'im-invalid' },
      errPhrase(LABEL_EMAIL, ERR_SUFFIX_INVALID),
    ],
    [
      'required',
      'password',
      undefined,
      errPhrase(LABEL_PASSWORD, ERR_SUFFIX_REQUIRED),
    ],
    ['short', 'password', '12345', errPhrase(LABEL_PASSWORD, ERR_SUFFIX_SHORT)],
    [
      'long',
      'password',
      'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfx',
      errPhrase(LABEL_PASSWORD, ERR_SUFFIX_LONG),
    ],
    [
      'invalid type',
      'password',
      { msg: 'im-invalid' },
      errPhrase(LABEL_PASSWORD, ERR_SUFFIX_INVALID),
    ],
  ])('%s %s', async (_, field, value, errmsg) => {
    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: {
        ...payload,
        [field]: value,
      },
    } as RequestOptions);

    // Exec request
    await signupHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(400);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: errmsg, field });
  });

  test('signupPreflight error', async () => {
    // Spy console error
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock signup preflight error
    const errmsg = 'Test error message';
    jest
      .spyOn(signupPreflightModule, 'signupPreflight')
      .mockRejectedValue(new Error(errmsg));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    // Exec
    await signupHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        ERR_CONSOLE_CAUGHT_INTERNAL,
        errmsg,
      );
    });
  });

  test('db-signup error', async () => {
    // Spy console error
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock signup preflight success
    jest
      .spyOn(signupPreflightModule, 'signupPreflight')
      .mockImplementationOnce(jest.fn());

    // Mock signup preflight error
    const errmsg = 'Test error message';
    jest.spyOn(dbSignupModule, 'dbSignup').mockRejectedValue(new Error(errmsg));

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    // Exec
    await signupHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(500);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({ message: ERR_INTERNAL });

    // Assert console error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        ERR_CONSOLE_CAUGHT_INTERNAL,
        errmsg,
      );
    });
  });

  test('success', async () => {
    // Mock signup preflight success
    jest
      .spyOn(signupPreflightModule, 'signupPreflight')
      .mockImplementationOnce(jest.fn());

    // Mock signup preflight success
    jest
      .spyOn(dbSignupModule, 'dbSignup')
      .mockResolvedValueOnce([session, accessToken]);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: payload,
    } as RequestOptions);

    // Exec
    await signupHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      session,
      message: `Welcome ${payload.firstname}!`,
    });
  });

  test.each([
    ['min-length', 'firstname', 'xx'],
    ['min-length', 'lastname', 'xx'],
    ['min-length', 'username', 'demo'],
    ['min-length', 'password', '123456'],
    ['max-length', 'firstname', 'asdfasdfasdfasdfasdfasdfasdfasdf'],
    ['max-length', 'lastname', 'asdfasdfasdfasdfasdfasdfasdfasdf'],
    ['max-length', 'username', 'asdfasdfasdfasdfasdfasdfasdfasdf'],
    [
      'max-length',
      'password',
      'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
    ],
  ])('%s %s ok', async (_title, field, value) => {
    // Mock signup preflight success
    jest
      .spyOn(signupPreflightModule, 'signupPreflight')
      .mockImplementationOnce(jest.fn());

    // Mock signup preflight success
    jest
      .spyOn(dbSignupModule, 'dbSignup')
      .mockResolvedValueOnce([session, accessToken]);

    // Mock request
    const { req, res } = createMocks<MockApiRequest, MockApiResponse>({
      // Defaults to 'POST' method with valid fake payload
      method: METHOD_POST,
      body: { ...payload, [field]: value },
    } as RequestOptions);

    // Exec
    await signupHandler(req, res);

    // Assert status code
    expect(res._getStatusCode()).toBe(200);

    // Assert error message
    expect(res._getJSONData()).toStrictEqual({
      session,
      message: `Welcome ${field === 'firstname' ? value : payload.firstname}!`,
    });
  });
});
