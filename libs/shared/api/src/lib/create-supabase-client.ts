import { createClient } from '@supabase/supabase-js';

export type Options = {
  isAnon: boolean;
};

const defaultOptions: Options = {
  isAnon: true,
};

export const errMissingEnv = (env: string) => `supabase missing env: ${env}`;

export const createSupabaseClient = (_options?: Options) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE } =
    process.env;
  if (!SUPABASE_URL) {
    console.error(errMissingEnv('SUPABASE_URL'));
    throw new Error(errMissingEnv('SUPABASE_URL'));
  }

  if (!SUPABASE_ANON_KEY) {
    console.error(errMissingEnv('SUPABASE_ANON_KEY'));
    throw new Error(errMissingEnv('SUPABASE_ANON_KEY'));
  }

  if (!SUPABASE_SERVICE_ROLE) {
    console.error(errMissingEnv('SUPABASE_SERVICE_ROLE'));
    throw new Error(errMissingEnv('SUPABASE_SERVICE_ROLE'));
  }

  const options: Options = {
    ...defaultOptions,
    ..._options,
  };

  return createClient(
    SUPABASE_URL,
    options.isAnon ? SUPABASE_ANON_KEY : SUPABASE_SERVICE_ROLE,
  );
};
