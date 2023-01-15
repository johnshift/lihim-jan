import { waitFor } from '@testing-library/react';

import { SupabaseClient } from '@supabase/supabase-js';

import * as sharedApi from '@lihim/shared/api';
import { ERR_INTERNAL } from '@lihim/shared/core';

import { dbLogout } from './db-logout';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('dbLogout', () => {
  test('error supabase signout', async () => {
    // Spy console error
    const consoleSpy = jest.spyOn(console, 'error');

    // Mock supabase auth signout error
    const errmsg = 'Test error message';
    const signOut = jest.fn().mockReturnValueOnce({
      error: {
        message: errmsg,
      },
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValue({
      auth: {
        signOut,
      },
    } as unknown as SupabaseClient);

    // Exec
    expect(dbLogout).rejects.toThrowError(ERR_INTERNAL);

    // Assert console spy
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('logout error =', errmsg);
    });
  });

  test('success', async () => {
    // Mock supabase auth signout success
    const signOut = jest.fn().mockReturnValueOnce({
      error: null,
    });
    jest.spyOn(sharedApi, 'createSupabaseClient').mockReturnValue({
      auth: {
        signOut,
      },
    } as unknown as SupabaseClient);

    // Exec
    expect(await dbLogout()).toBe(undefined);
  });
});
