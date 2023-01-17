/* eslint-disable @typescript-eslint/no-explicit-any */

import { faker } from '@faker-js/faker';

import { LoggedInSession } from '@lihim/auth/core';
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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    try {
      await getSessionInfo(testEmail);
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
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValueOnce({
      rpc: rpcFn,
    } as any);

    // Exec
    const result = await getSessionInfo((testSession as LoggedInSession).email);

    // Assert console log
    expect(result).toStrictEqual(testSession);
  });
});
