import { SupabaseClient } from '@supabase/supabase-js';

import * as sharedApi from '@lihim/shared/api';

import { dbLogout } from './db-logout';

jest.mock('@lihim/shared/api', () => ({
  __esModule: true,
  ...jest.requireActual('@lihim/shared/api'),
}));

describe('dbLogout', () => {
  test('error supabase signout', async () => {
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
    expect(dbLogout).rejects.toThrowError('logout error = ' + errmsg);
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
