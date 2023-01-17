/* eslint-disable camelcase */

import { SupabaseClient } from '@supabase/supabase-js';

import { fakeSignupPayload } from '@lihim/auth/testutils';

import { dbSignup } from './db-signup';

describe('dbSignup', () => {
  // Test vars
  const payload = fakeSignupPayload();

  test('signup error', () => {
    // Mock signup error
    const errmsg = 'Test error message';
    const supabase = {
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: null,
          error: {
            message: errmsg,
          },
        }),
      },
    } as unknown as SupabaseClient;

    // Assert error
    expect(dbSignup(supabase, payload)).rejects.toThrowError(
      'db-signup error: ' + errmsg,
    );
  });

  test('signup no user returned', () => {
    // Mock signup no user
    const supabase = {
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: { user: null },
          error: null,
        }),
      },
    } as unknown as SupabaseClient;

    // Assert error
    expect(dbSignup(supabase, payload)).rejects.toThrowError(
      'db-signup no user returned',
    );
  });

  test('signup no session returned', () => {
    // Mock signup no user
    const supabase = {
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: { user: 'fake-user', session: null },
          error: null,
        }),
      },
    } as unknown as SupabaseClient;

    // Assert error
    expect(dbSignup(supabase, payload)).rejects.toThrowError(
      'db-signup no session returned',
    );
  });

  test('success', async () => {
    // Mock signup success
    const userId = 'fake-id';
    const access_token = 'fake-access-token';
    const supabase = {
      auth: {
        signUp: jest.fn().mockResolvedValueOnce({
          data: {
            user: { id: userId },
            session: { access_token },
          },
          error: null,
        }),
      },
    } as unknown as SupabaseClient;

    // Exec signup
    const [session, accessToken] = await dbSignup(supabase, payload);

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
