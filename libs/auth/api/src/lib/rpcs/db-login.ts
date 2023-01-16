import { AuthApiError } from '@supabase/supabase-js';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import { createSupabaseClient } from '@lihim/shared/api';
import { ApiError } from '@lihim/shared/core';

export const dbLogin = async (email: string, password: string) => {
  // Supabase anon client
  const supabase = createSupabaseClient();

  // Signin using email
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Internal error
    if ((error as AuthApiError).status >= 500) {
      throw new Error(
        'signin api error: ' +
          `\n\tstatus=${(error as AuthApiError).status} ` +
          `\n\tmsg=${error.message}`,
      );
    }

    // Incorrect signin by default
    throw new ApiError(401, ERR_LOGIN_INCORRECT);
  }

  if (!data.session) {
    throw new Error('No session returned after signin');
  }

  // Return access token
  return data.session.access_token;
};
