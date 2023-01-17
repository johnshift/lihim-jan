import type { NextApiRequest, NextApiResponse } from 'next';

import jwtDecode from 'jwt-decode';

import type { Session } from '@lihim/auth/core';
import { apiMiddleware, createSupabaseClient } from '@lihim/shared/api';
import type { GenericResponse } from '@lihim/shared/core';
import { METHOD_GET } from '@lihim/shared/core';

import { COOKEY_CSRF, COOKEY_SESSION } from '../constants';
import type { SupabaseAccessToken } from '../types';
import { decryptSessionCookie } from '../utils/session-cipher';
import { setSessionCookie } from '../utils/set-session-cookie';

const getSessionCookies = (req: NextApiRequest) => {
  // Get cookies from request
  const encryptedToken = req.cookies[COOKEY_SESSION];
  const csrfToken = req.cookies[COOKEY_CSRF];

  if (!encryptedToken) {
    throw new Error('Anon: missing encrypted token');
  }

  if (!csrfToken) {
    throw new Error('Anon: missing csrf token');
  }

  return { encryptedToken, csrfToken };
};

const getSessionFromCookies = (encryptedToken: string, csrfToken: string) => {
  // Decrypt session cookie
  const [accessToken, session, csrf] = decryptSessionCookie(encryptedToken);

  // Throw error on csrf mismatch
  if (csrfToken !== csrf) {
    throw new Error('Anon: csrf token mismatch');
  }

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

  return { session };
};

const refreshSessionCookie = async (res: NextApiResponse, session: Session) => {
  // Supabase anon client
  const supabase = createSupabaseClient();

  // Exec get-sesison using supabase
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('Anon: getSession error ');
  }

  if (!data.session?.access_token) {
    throw new Error('Anon: no access-token returned');
  }

  // Update cookies with refreshed access-token
  setSessionCookie(res, session, data.session.access_token);
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Session | GenericResponse>,
) => {
  // If any error occurs, we return anon session
  try {
    // Retrieve session cookie from request
    const { encryptedToken, csrfToken } = getSessionCookies(req);

    // Decrypt cookie session
    const { session } = getSessionFromCookies(encryptedToken, csrfToken);

    // Refresh session
    await refreshSessionCookie(res, session);

    // Success response
    return res.status(200).json({ ...session });
  } catch {
    return res.status(200).json({ isAnon: true });
  }
};

export const sessionHandler = apiMiddleware(handler, { method: METHOD_GET });
