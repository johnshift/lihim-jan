import { AuthApiError, SupabaseClient } from '@supabase/supabase-js';

import { ERR_LOGIN_INCORRECT } from '@lihim/auth/core';
import { ApiError } from '@lihim/shared/core';

type Credentials = {
  email: string;
  password: string;
};

export const dbLogin = async (
  supabase: SupabaseClient,
  { email, password }: Credentials,
) => {
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
