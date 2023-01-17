import type { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { deleteCookie } from 'cookies-next';

import { MSG_LOGOUT_DONE } from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import { METHOD_POST } from '@lihim/shared/core';

import {
  COOKEY_CSRF,
  COOKEY_SESSION,
  defaultCookieOptions,
} from '../constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Supabase client
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });

  // Logout in supabase
  const { error } = await supabaseServerClient.auth.signOut();
  if (error) {
    throw new Error('logout error = ' + error.message);
  }

  // Remove session cookies
  const cookieOptions = { req, res, ...defaultCookieOptions };
  deleteCookie(COOKEY_SESSION, cookieOptions);
  deleteCookie(COOKEY_CSRF, cookieOptions);

  // Success response
  return res.status(200).json({ message: MSG_LOGOUT_DONE });
};

export const logoutHandler = apiMiddleware(handler, { method: METHOD_POST });
