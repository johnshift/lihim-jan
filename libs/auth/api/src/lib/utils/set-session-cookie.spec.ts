import { createResponse } from 'node-mocks-http';
import { uid } from 'uid';

import { fakeSession } from '@lihim/auth/testutils';
import type { MockApiResponse } from '@lihim/shared/api';

import { COOKEY_CSRF, COOKEY_SESSION } from '../constants';

import { setSessionCookie } from './set-session-cookie';

describe('setSessionCookie', () => {
  test('ok', async () => {
    // Mock args
    const res = createResponse<MockApiResponse>();
    const session = fakeSession();
    const accessToken = uid();

    await setSessionCookie(res, session, accessToken);

    // Assert cookies present
    const cookies = res._getHeaders()['set-cookie'] as string[];
    expect(cookies[0].includes(COOKEY_CSRF)).toBeTruthy();
    expect(cookies[1].includes(COOKEY_SESSION)).toBeTruthy();
  });
});
