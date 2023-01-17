import { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import {
  ERR_LOGIN_INCORRECT,
  LoginPayloadSchema,
  MSG_LOGIN_OK_INFO,
} from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import { ApiError, METHOD_POST } from '@lihim/shared/core';

import { defaultCookieOptions } from '../constants';
import { dbLogin } from '../rpcs/db-login';
import { getEmail } from '../rpcs/get-email';
import { getSessionInfo } from '../rpcs/get-session-info';
import { setSessionCookie } from '../utils/set-session-cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate payload
  const parseResult = LoginPayloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new ApiError(400, ERR_LOGIN_INCORRECT);
  }

  // Validated payload
  const { principal, password } = parseResult.data;

  // Supabase client
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });

  // Retrieve email (since principal can be username)
  const email = await getEmail(supabaseServerClient, principal);

  // Login in supabase
  const accessToken = await dbLogin(supabaseServerClient, { email, password });

  // Retrieve session info
  const session = await getSessionInfo(supabaseServerClient, email);

  // Set session cookie
  const cookieOptions = { req, res, ...defaultCookieOptions };
  setSessionCookie(session, accessToken, cookieOptions);

  // Success response
  return res.status(200).json({ session, message: MSG_LOGIN_OK_INFO });
};

export const loginHandler = apiMiddleware(handler, { method: METHOD_POST });
