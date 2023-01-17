import { SupabaseClient } from '@supabase/supabase-js';

import { Session, SignupPayload } from '@lihim/auth/core';

export const dbSignup = async (
  supabase: SupabaseClient,
  payload: SignupPayload,
): Promise<[Session, string]> => {
  // Avatar url
  const avatar = `https://avatars.dicebear.com/api/identicon/${payload.username}.svg`;
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        username: payload.username,
        avatar,
        firstname: payload.firstname,
        lastname: payload.lastname,
      },
    },
  });

  // Throw 500 if error
  if (error) {
    throw new Error('db-signup error: ' + error.message);
  }

  // Throw 500 if no user
  if (!data.user) {
    throw new Error('db-signup no user returned');
  }

  // Throw 500 if no session
  if (!data.session) {
    throw new Error('db-signup no session returned');
  }

  return [
    {
      id: data.user.id,
      ...payload,
      bio: '',
      avatar,
      isAnon: false,
    },
    data.session.access_token,
  ];
};
