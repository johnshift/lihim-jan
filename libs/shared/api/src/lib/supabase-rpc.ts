import { SupabaseClient } from '@supabase/supabase-js';

type FunctionSignature = {
  Args: Record<string, unknown>;
  Returns: string | Record<string, unknown> | Record<string, unknown>[] | null;
};

export const supabaseRpc = async <
  RpcName extends string,
  RpcSignature extends FunctionSignature,
>(
  supabase: SupabaseClient,
  rpcName: RpcName,
  args: RpcSignature['Args'],
) => supabase.rpc<RpcName, RpcSignature>(rpcName, args).single();
