import type { NextApiResponse } from 'next';

import { CookieSerializeOptions, serialize } from 'cookie';

import type { Session } from '@lihim/auth/core';

import { COOKEY_CSRF, COOKEY_SESSION } from '../constants';

import { encryptSessionCookie } from './session-cipher';

const defaultCookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  secure: process.env['NODE_ENV'] === 'production',
} as CookieSerializeOptions;

export const setSessionCookie = async (
  res: NextApiResponse,
  session: Session,
  accessToken: string,
) => {
  // Generate session tokens
  const [sessionToken, csrfToken] = await encryptSessionCookie(
    accessToken,
    session,
  );

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
