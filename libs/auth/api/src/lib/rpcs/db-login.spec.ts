/* eslint-disable @typescript-eslint/no-explicit-any */
import { waitFor } from '@testing-library/react';

import { faker } from '@faker-js/faker';
import { Session } from '@supabase/supabase-js';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import * as sharedApi from '@lihim/shared/api';
import { ApiError, ERR_INTERNAL } from '@lihim/shared/core';

import { dbLogin } from './db-login';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('supabase login', () => {
  // Mock values
  const testEmail = faker.internet.email();
  const testPassword = faker.internet.password();

  test.each([
    ['error', 401, ERR_LOGIN_INCORRECT],
    ['internal-error', 500, ERR_INTERNAL],
  ])(
    'throws error on supabase signin %s',
    async (errorType, status, errMsg) => {
      // Spy console.log
      const consoleSpy = jest.spyOn(console, 'error');

      // Test values
      const errorMsg = faker.lorem.sentence();

      // Mock supabase signin error
      const signInWithPassword = jest.fn().mockReturnValue({
        data: { session: null, user: null },
        error: {
          status,
          message: errorMsg,
        },
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
        if (errorType !== 'internal-error') {
          expect((error as ApiError).status).toBe(status);
        }

        expect((error as Error).message).toBe(errMsg);
      }

      // Assert console if internal error
      if (errorType === 'internal-error') {
        // Assert console log
        await waitFor(() =>
          expect(consoleSpy).toHaveBeenCalledWith(
            'signin api error:',
            `\n\tstatus=${status}`,
            `\n\tmsg=${errorMsg}`,
          ),
        );
      }
    },
  );

  it('throws error when signin does not return data.session', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

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
      expect((error as Error).message).toBe(ERR_INTERNAL);
    }

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'No session returned after signin',
      ),
    );
  });

  it('returns access-token when no error was thrown', async () => {
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
