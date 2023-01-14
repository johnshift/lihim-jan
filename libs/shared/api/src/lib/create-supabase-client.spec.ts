import { waitFor } from '@testing-library/react';

import {
  createSupabaseClient,
  errMissingEnv,
  Options,
} from './create-supabase-client';

describe('createSupabaseClient', () => {
  // Reference env
  const PREV_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...PREV_ENV }; // Make a copy
  });

  afterEach(() => {
    process.env = PREV_ENV; // Restore
  });

  test.each([
    ['SUPABASE_URL'],
    ['SUPABASE_ANON_KEY'],
    ['SUPABASE_SERVICE_ROLE'],
  ])('missing env: %s', async (envKey) => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Unset env
    process.env[envKey] = undefined;

    // Create client
    try {
      createSupabaseClient();
    } catch (error) {
      expect((error as Error).message).toBe(errMissingEnv(envKey));
    }

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(errMissingEnv(envKey)),
    );
  });

  test.each<[Options | undefined]>([
    [undefined],
    [{ isAnon: true }],
    [{ isAnon: false }],
  ])('create client: options = %o', (options) => {
    const client = createSupabaseClient(options);
    expect(client).toBeDefined();
  });
});
