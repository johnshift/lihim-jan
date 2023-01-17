import type { NextApiRequest, NextApiResponse } from 'next';

import {
  createServerSupabaseClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import type { CookieSerializeOptions } from 'cookie';
import { getCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';

import type { Session } from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import type { GenericResponse } from '@lihim/shared/core';
import { METHOD_GET } from '@lihim/shared/core';

import {
  COOKEY_CSRF,
  COOKEY_SESSION,
  defaultCookieOptions,
} from '../constants';
import type { SupabaseAccessToken } from '../types';
import { decryptSessionCookie } from '../utils/session-cipher';
import { setSessionCookie } from '../utils/set-session-cookie';

const getSessionFromCookies = (cookieOptions: CookieSerializeOptions) => {
  // Retrieve cookie from request
  const encryptedCookie = getCookie(COOKEY_SESSION, cookieOptions);
  const csrfCookie = getCookie(COOKEY_CSRF, cookieOptions);

  // Convert cookie to string
  const encryptedToken = encryptedCookie?.toString();
  const csrfToken = csrfCookie?.toString();

  if (!encryptedToken) {
    throw new Error('Anon: missing encrypted token');
  }

  if (!csrfToken) {
    throw new Error('Anon: missing csrf token');
  }

  // Decrypt session cookie
  const [accessToken, session, csrf] = decryptSessionCookie(encryptedToken);

  // Throw error on csrf mismatch
  if (csrfToken !== csrf) {
    throw new Error('Anon: csrf token mismatch');
  }

  return { accessToken, session };
};

const validateAccessToken = (accessToken: string) => {
  // Parse accessToken
  let token: SupabaseAccessToken;
  try {
    token = jwtDecode(accessToken);
  } catch {
    // Token cannot be parsed -> not logged in
    // return anon to indicate not logged in
    throw new Error('Anon: failed to parse access Token');
  }

  const now = Math.floor(Date.now() / 1000);
  const validExp = now < token.exp; // Only valid is exp is in the future
  const authenticated = token.role === 'authenticated';

  // Throw error on expired access token
  if (!validExp) {
    throw new Error('Anon: expired access-token');
  }

  // Throw error on unauthenticated access token
  if (!authenticated) {
    throw new Error('Anon: unauthenticated access-token');
  }
};

const refreshSessionCookie = async (
  supabase: SupabaseClient,
  session: Session,
  cookieOptions: CookieSerializeOptions,
) => {
  // Exec get-sesison using supabase
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Anon: getSession error ');
  }

  if (!data.session?.access_token) {
    throw new Error('Anon: no access-token returned');
  }

  // Update cookies with refreshed access-token
  setSessionCookie(session, data.session.access_token, cookieOptions);
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Session | GenericResponse>,
) => {
  // If any error occurs, we return anon session
  try {
    // Decrypt cookie session
    const cookieOptions = { req, res, ...defaultCookieOptions };
    const { accessToken, session } = getSessionFromCookies(cookieOptions);

    // Validate accessToken
    validateAccessToken(accessToken);

    // Supabase client
    const supabaseServerClient = createServerSupabaseClient({
      req,
      res,
    });

    // Refresh session
    await refreshSessionCookie(supabaseServerClient, session, cookieOptions);

    // Success response
    return res.status(200).json({ ...session });
  } catch {
    return res.status(200).json({ isAnon: true });
  }
};

export const sessionHandler = apiMiddleware(handler, { method: METHOD_GET });
