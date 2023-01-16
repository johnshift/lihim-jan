/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fakeSignupPayload } from '@lihim/auth/testutils';
import * as sharedApi from '@lihim/shared/api';

import { dbSignup } from './db-signup';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('dbSignup', () => {
  // Test vars
  const payload = fakeSignupPayload();

  test('signup error', () => {
    // Mock signup error
    const errmsg = 'Test error message';
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: null,
          error: {
            message: errmsg,
          },
        }),
      },
    } as any);

    // Assert error
    expect(dbSignup(payload)).rejects.toThrowError(
      'db-signup error: ' + errmsg,
    );
  });

  test('signup no user returned', () => {
    // Mock signup no user
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: { user: null },
          error: null,
        }),
      },
    } as any);

    // Assert error
    expect(dbSignup(payload)).rejects.toThrowError(
      'db-signup no user returned',
    );
  });

  test('signup no session returned', () => {
    // Mock signup no user
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: { user: 'fake-user', session: null },
          error: null,
        }),
      },
    } as any);

    // Assert error
    expect(dbSignup(payload)).rejects.toThrowError(
      'db-signup no session returned',
    );
  });

  test('success', async () => {
    // Mock signup success
    const userId = 'fake-id';
    const access_token = 'fake-access-token';
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: {
            user: { id: userId },
            session: { access_token },
          },
          error: null,
        }),
      },
    } as any);

    // Exec signup
    const [session, accessToken] = await dbSignup(payload);

    // Assert
    expect(session).toStrictEqual({
      id: userId,
      ...payload,
      bio: '',
      avatar: `https://avatars.dicebear.com/api/identicon/${payload.username}.svg`,
      isAnon: false,
    });
    expect(accessToken).toBe(access_token);
  });
});
