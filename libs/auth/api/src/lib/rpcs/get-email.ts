import { EmailSchema, ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import { createSupabaseClient, supabaseRpc } from '@lihim/shared/api';
import { ApiError, ERR_INTERNAL } from '@lihim/shared/core';

import { RPC_GET_EMAIL } from '../constants';

// Supabase RPC generics
type RpcName = typeof RPC_GET_EMAIL;
type RpcSignature = {
  Args: { principal: string };
  Returns: string;
};

export const getEmail = async (_principal: string): Promise<string> => {
  // Convert principal to lowercase
  const principal = _principal.toLowerCase();

  // If principal is email, no need to get-email
  const parseResult = EmailSchema.safeParse(principal);
  if (parseResult.success) {
    return principal;
  }

  // Supabase anon client
  const supabase = createSupabaseClient();

  // Execute get-email rpc
  const { data, error } = await supabaseRpc<RpcName, RpcSignature>(
    supabase,
    RPC_GET_EMAIL,
    {
      principal,
    },
  );

  // This is expected to work, if error meaning on supabase's end -> return 500
  if (error) {
    console.error(
      'getEmail postgres error:',
      `\n\tcode=${error.code}`,
      `\n\tmsg=${error.message}`,
      `\n\thint=${error.hint}`,
      `\n\tdetails=${error.details}`,
    );
    throw new Error(ERR_INTERNAL);
  }

  // If no email matches principal, incorrect signin
  if (!data) {
    throw new ApiError(400, ERR_LOGIN_INCORRECT);
  }

  // Data returns an array, we select only first element
  return data.toLowerCase();
};
