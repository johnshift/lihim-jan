import { createRequest, createResponse } from 'node-mocks-http';
import { uid } from 'uid';

import { fakeSession } from '@lihim/auth/testutils';
import type { MockApiRequest, MockApiResponse } from '@lihim/shared/api';

import { defaultCookieOptions } from '../constants';

import { setSessionCookie } from './set-session-cookie';

describe('setSessionCookie', () => {
  test('smoke', () => {
    // Mock args
    const req = createRequest<MockApiRequest>();
    const res = createResponse<MockApiResponse>();
    const session = fakeSession();
    const accessToken = uid();
    const cookieOptions = { req, res, ...defaultCookieOptions };

    setSessionCookie(session, accessToken, cookieOptions);
  });
});
