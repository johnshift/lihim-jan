/* eslint-disable @typescript-eslint/no-explicit-any */

import { waitFor } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import { fakeSession } from '@lihim/auth/testutils';
import * as sharedApi from '@lihim/shared/api';

import { getSessionInfo } from './get-session-info';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('getSessionInfo', () => {
  // Test value(s)
  const testEmail = faker.internet.email();

  it('throws error when rpc fails', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    try {
      await getSessionInfo(testEmail);
    } catch (error) {
      expect((error as Error).message).toBe(message);
    }

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'get-session-info error (500): error =',
        message,
      ),
    );
  });

  it('throws error when no data was returned by data', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock rpc no data returned
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
      await getSessionInfo(testEmail);
    } catch (error) {
      expect((error as Error).message).toBe('No data returned');
    }

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'get-session-info no data returned (500): data =',
        null,
      ),
    );
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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    const result = await getSessionInfo(testEmail);

    // Assert console log
    expect(result).toBe(testSession);
  });
});
