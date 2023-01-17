import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import { ApiError } from '@lihim/shared/core';

import { getEmail } from './get-email';

describe('getEmail', () => {
  it('returns immediately if principal is already email', async () => {
    // Test value(s)
    const principal = faker.internet.email();

    // Mock supabase
    const supabase = {
      rpc: jest.fn().mockReturnValue({
        single: jest.fn(),
      }),
    } as unknown as SupabaseClient;

    // Exec
    const email = await getEmail(supabase, principal);

    // Assert
    expect(email).toBe(principal.toLowerCase());
  });

  it('throws error on rpc error', async () => {
    // Test value(s)
    const principal = 'test-username';

    // Mock error
    const message = 'postgres-error-message';
    const details = 'postgres-error-details';
    const hint = 'postgres-error-hint';
    const code = 'postgres-error-code';

    // Mock rpc returns error
    const singleFn = jest.fn().mockReturnValue({
      error: {
        message,
        details,
        hint,
        code,
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
      await getEmail(supabase, principal);
    } catch (error) {
      expect((error as Error).message).toBe(
        'getEmail postgres error: ' +
          `\n\tcode=${code}` +
          `\n\tmsg=${message}` +
          `\n\thint=${hint}` +
          `\n\tdetails=${details}`,
      );
    }
  });

  it('throws error when no data was returned by rpc', async () => {
    // Test value(s)
    const principal = 'test-username';

    // Mock rpc does not return data
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
      await getEmail(supabase, principal);
    } catch (error) {
      expect((error as ApiError).status).toBe(400);
      expect((error as ApiError).message).toBe(ERR_LOGIN_INCORRECT);
    }
  });

  it('does not throw error if OK', async () => {
    // Test value(s)
    const principal = 'test-username';
    const testEmail = faker.internet.email();

    // Mock rpc ok
    const singleFn = jest.fn().mockReturnValue({
      data: testEmail,
      error: null,
    });
    const rpcFn = jest.fn().mockReturnValue({
      single: singleFn,
    });
    const supabase = {
      rpc: rpcFn,
    } as unknown as SupabaseClient;

    // Exec
    const result = await getEmail(supabase, principal);

    // Assert
    expect(result).toBe(testEmail.toLowerCase());
  });
});
