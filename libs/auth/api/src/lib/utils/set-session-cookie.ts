import type { CookieSerializeOptions } from 'cookie';
import { setCookie } from 'cookies-next';

import type { Session } from '@lihim/auth/core';

import { COOKEY_CSRF, COOKEY_SESSION } from '../constants';

import { encryptSessionCookie } from './session-cipher';

export const setSessionCookie = (
  session: Session,
  accessToken: string,
  cookieOptions: CookieSerializeOptions,
) => {
  // Generate session tokens
  const [sessionToken, csrfToken] = encryptSessionCookie(accessToken, session);

  // Create auth cookies
  setCookie(COOKEY_SESSION, sessionToken, cookieOptions);
  setCookie(COOKEY_CSRF, csrfToken, cookieOptions);
};
