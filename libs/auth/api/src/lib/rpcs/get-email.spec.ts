/* eslint-disable @typescript-eslint/no-explicit-any */

import { waitFor } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import * as sharedApi from '@lihim/shared/api';
import { ApiError, ERR_INTERNAL } from '@lihim/shared/core';

import { getEmail } from './get-email';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('getEmail', () => {
  it('returns immediately if principal is already email', async () => {
    // Test value(s)
    const principal = faker.internet.email();

    // Exec
    const email = await getEmail(principal);

    // Assert
    expect(email).toBe(principal.toLowerCase());
  });

  it('throws error on rpc error', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    try {
      await getEmail(principal);
    } catch (error) {
      expect((error as Error).message).toBe(ERR_INTERNAL);
    }

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'getEmail postgres error:',
        `\n\tcode=${code}`,
        `\n\tmsg=${message}`,
        `\n\thint=${hint}`,
        `\n\tdetails=${details}`,
      ),
    );
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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    try {
      await getEmail(principal);
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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    const result = await getEmail(principal);

    // Assert
    expect(result).toBe(testEmail.toLowerCase());
  });
});
