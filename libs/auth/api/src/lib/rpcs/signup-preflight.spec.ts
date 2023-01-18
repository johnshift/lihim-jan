/* eslint-disable @typescript-eslint/no-explicit-any */

import { SupabaseClient } from '@supabase/supabase-js';

import { ERR_EMAIL_TAKEN, ERR_USERNAME_TAKEN } from '@lihim/auth/core';
import { fakeSignupPayload } from '@lihim/auth/testutils';
import * as sharedApi from '@lihim/shared/api';
import { ApiError } from '@lihim/shared/core';

import { signupPreflight } from './signup-preflight';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('signupPreflight', () => {
  // Test vars
  const payload = fakeSignupPayload();
  const supabase = jest.fn() as unknown as SupabaseClient;

  test('rpc error', async () => {
    // Mock rpc error
    const errmsg = 'Test error message';
    jest.spyOn(sharedApi, 'supabaseRpc').mockResolvedValueOnce({
      data: null,
      error: {
        message: errmsg,
      },
    } as any);

    // Assert error
    expect(signupPreflight(supabase, payload)).rejects.toThrowError(
      'signup-preflight error: ' + errmsg,
    );
  });

  test('empty data', async () => {
    // Mock rpc empty data
    jest.spyOn(sharedApi, 'supabaseRpc').mockResolvedValueOnce({
      data: null,
      error: null,
    } as any);

    // Assert error
    expect(signupPreflight(supabase, payload)).rejects.toThrowError(
      'signup-preflight no data returned',
    );
  });

  test('username taken', async () => {
    // Mock rpc username taken
    jest.spyOn(sharedApi, 'supabaseRpc').mockResolvedValueOnce({
      data: { usernameTaken: true },
      error: null,
    } as any);

    // Assert error
    try {
      await signupPreflight(supabase, payload);
    } catch (error) {
      const err = error as ApiError;
      expect(err.status).toBe(400);
      expect(err.message).toBe(ERR_USERNAME_TAKEN);
    }
  });

  test('email taken', async () => {
    // Mock rpc email taken
    jest.spyOn(sharedApi, 'supabaseRpc').mockResolvedValueOnce({
      data: { emailTaken: true },
      error: null,
    } as any);

    // Assert error
    try {
      await signupPreflight(supabase, payload);
    } catch (error) {
      const err = error as ApiError;
      expect(err.status).toBe(400);
      expect(err.message).toBe(ERR_EMAIL_TAKEN);
    }
  });

  test('success', async () => {
    // Mock rpc email taken
    jest.spyOn(sharedApi, 'supabaseRpc').mockResolvedValueOnce({
      data: { emailTaken: false, usernameTaken: false },
      error: null,
    } as any);

    // Assert error
    expect(async () => signupPreflight(supabase, payload)).not.toThrowError();
  });
});
