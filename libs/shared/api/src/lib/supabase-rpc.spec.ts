import { SupabaseClient } from '@supabase/supabase-js';

import { supabaseRpc } from './supabase-rpc';

describe('supabaseRpc', () => {
  test('works', () => {
    // Mock supabase client
    const mockData = { message: 'OK' };
    const singleFn = jest
      .fn()
      .mockReturnValueOnce({ data: mockData, error: null });
    const rpcFn = jest.fn().mockReturnValueOnce({ single: singleFn });
    const supabase = { rpc: rpcFn } as unknown as SupabaseClient;

    const result = supabaseRpc(supabase, 'asdf', { message: 'asdf' });
    expect(result).toBeDefined();
  });
});
