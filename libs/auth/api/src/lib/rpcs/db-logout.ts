import { createSupabaseClient } from '@lihim/shared/api';
import { ERR_INTERNAL } from '@lihim/shared/core';

export const dbLogout = async () => {
  // Supabase anon client
  const supabase = createSupabaseClient();

  // Logout in supabase
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('logout error =', error.message);
    throw new Error(ERR_INTERNAL);
  }
};
