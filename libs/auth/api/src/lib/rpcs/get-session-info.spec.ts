import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

import { LoggedInSession } from '@lihim/auth/core';
import { fakeSession } from '@lihim/auth/testutils';

import { getSessionInfo } from './get-session-info';

describe('getSessionInfo', () => {
  // Test value(s)
  const testEmail = faker.internet.email();

  it('throws error when rpc fails', async () => {
    // Mock rpc returns error
    const message = 'test-error-message';
    const singleFn = jest.fn().mockReturnValue({
      error: {
        message,
      },
    });
    const rpcFn = jest.fn().mockReturnValue({
      single: singleFn,
    });
    const supabase = {
      rpc: rpcFn,
    } as unknown as SupabaseClient;

    // Exec
    try {
      await getSessionInfo(supabase, testEmail);
    } catch (error) {
      expect((error as Error).message).toBe(
        'get-session-info error: ' + message,
      );
    }
  });

  it('throws error when no data was returned by data', async () => {
    // Mock rpc no data returned
    const singleFn = jest.fn().mockReturnValue({
      data: null,
      error: null,
    });
    const rpcFn = jest.fn().mockReturnValue({
      single: singleFn,
    });
    const supabase = {
      rpc: rpcFn,
    } as unknown as SupabaseClient;

    // Exec
    try {
      await getSessionInfo(supabase, testEmail);
    } catch (error) {
      expect((error as Error).message).toBe(
        'get-session-info no data returned',
      );
    }
  });

  it('returns data when no error was thrown', async () => {
    // Mock rpc ok
    const testSession = fakeSession();
    const singleFn = jest.fn().mockReturnValue({
      data: testSession,
      error: null,
    });
    const rpcFn = jest.fn().mockReturnValue({
      single: singleFn,
    });
    const supabase = {
      rpc: rpcFn,
    } as unknown as SupabaseClient;

    // Exec
    const result = await getSessionInfo(
      supabase,
      (testSession as LoggedInSession).email,
    );

    // Assert console log
    expect(result).toStrictEqual(testSession);
  });

  it('returns data (without bio) when no error was thrown', async () => {
    // Mock rpc ok
    const testSession = fakeSession();
    const singleFn = jest.fn().mockReturnValue({
      data: { ...testSession, bio: undefined },
      error: null,
    });
    const rpcFn = jest.fn().mockReturnValue({
      single: singleFn,
    });
    const supabase = {
      rpc: rpcFn,
    } as unknown as SupabaseClient;

    // Exec
    const result = await getSessionInfo(
      supabase,
      (testSession as LoggedInSession).email,
    );

    // Assert console log
    expect(result).toStrictEqual(testSession);
  });
});
