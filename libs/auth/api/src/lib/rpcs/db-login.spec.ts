/* eslint-disable @typescript-eslint/no-explicit-any */

import { faker } from '@faker-js/faker';
import { Session } from '@supabase/supabase-js';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import * as sharedApi from '@lihim/shared/api';
import { ApiError } from '@lihim/shared/core';

import { dbLogin } from './db-login';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('supabase login', () => {
  // Mock values
  const testEmail = faker.internet.email();
  const testPassword = faker.internet.password();

  test('signin error', async () => {
    // Test values
    const errorMsg = faker.lorem.sentence();

    // Mock supabase signin error
    const signInWithPassword = jest.fn().mockReturnValue({
      data: { session: null, user: null },
      error: {
        status: 401,
        message: errorMsg,
      },
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signInWithPassword,
      },
    } as any);

    // Assert error
    try {
      await dbLogin(testEmail, testPassword);
    } catch (error) {
      const err = error as ApiError;
      expect(err.status).toBe(401);
      expect(err.message).toBe(ERR_LOGIN_INCORRECT);
    }
  });

  test('signin internal error', async () => {
    // Test values
    const errorMsg = faker.lorem.sentence();

    // Mock supabase signin error
    const signInWithPassword = jest.fn().mockReturnValue({
      data: { session: null, user: null },
      error: {
        status: 500,
        message: errorMsg,
      },
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signInWithPassword,
      },
    } as any);

    // Assert error
    try {
      await dbLogin(testEmail, testPassword);
    } catch (error) {
      expect((error as Error).message).toBe(
        `signin api error: \n\tstatus=500 \n\tmsg=${errorMsg}`,
      );
    }
  });

  test('no session returned', async () => {
    // Mock supabase signin no data returned
    const signInWithPassword = jest.fn().mockReturnValue({
      data: { session: null, user: null },
      error: null,
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signInWithPassword,
      },
    } as any);

    // Exec
    try {
      await dbLogin(testEmail, testPassword);
    } catch (error) {
      expect((error as Error).message).toBe('No session returned after signin');
    }
  });

  test('returns access-token on success', async () => {
    // Test values
    const testAccessToken = faker.datatype.uuid();

    // Mock supabase signin return access token
    const signInWithPassword = jest.fn().mockReturnValue({
      data: {
        // eslint-disable-next-line camelcase
        session: { access_token: testAccessToken } as unknown as Session,
        user: null,
      },
      error: null,
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      auth: {
        signInWithPassword,
      },
    } as any);

    // Exec
    const accessToken = await dbLogin(testEmail, testPassword);

    // Assert
    expect(accessToken).toBe(testAccessToken);
  });
});
