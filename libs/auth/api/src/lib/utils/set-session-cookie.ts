import type { NextApiResponse } from 'next';

import { serialize } from 'cookie';

import type { Session } from '@lihim/auth/core';

import {
  COOKEY_CSRF,
  COOKEY_SESSION,
  defaultCookieOptions,
} from '../constants';

import { encryptSessionCookie } from './session-cipher';

export const setSessionCookie = (
  res: NextApiResponse,
  session: Session,
  accessToken: string,
) => {
  // Generate session tokens
  const [sessionToken, csrfToken] = encryptSessionCookie(accessToken, session);

  // Create auth cookies
  const csrfCookie = serialize(COOKEY_CSRF, csrfToken, defaultCookieOptions);
  const sessionCookie = serialize(
    COOKEY_SESSION,
    sessionToken,
    defaultCookieOptions,
  );

  // Set cookies into response headers
  res.setHeader('Set-Cookie', [csrfCookie, sessionCookie]);
};
