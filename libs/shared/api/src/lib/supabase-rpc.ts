import { SupabaseClient } from '@supabase/supabase-js';

type FunctionSignature = {
  Args: Record<string, unknown>;
  Returns: string | Record<string, unknown> | Record<string, unknown>[];
};

export const supabaseRpc = async <
  RpcName extends string,
  RpcSignature extends FunctionSignature,
>(
  supabase: SupabaseClient,
  rpcName: RpcName,
  args: Record<string, unknown>,
) => supabase.rpc<RpcName, RpcSignature>(rpcName, args).single();
