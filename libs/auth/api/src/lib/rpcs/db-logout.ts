import { createSupabaseClient } from '@lihim/shared/api';

export const dbLogout = async () => {
  // Supabase anon client
  const supabase = createSupabaseClient();

  // Logout in supabase
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('logout error = ' + error.message);
  }
};
