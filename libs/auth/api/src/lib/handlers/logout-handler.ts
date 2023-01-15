import { NextApiRequest, NextApiResponse } from 'next';

import { serialize } from 'cookie';

import { MSG_LOGOUT_DONE } from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import { METHOD_POST } from '@lihim/shared/core';

import {
  COOKEY_CSRF,
  COOKEY_SESSION,
  defaultCookieOptions,
} from '../constants';
import { dbLogout } from '../rpcs/db-logout';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Logout in supabase
  await dbLogout();

  // Remove session cookies (set empty expired cookies)
  const sessionCookie = serialize(COOKEY_SESSION, '', {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  const csrfCookie = serialize(COOKEY_CSRF, '', {
    ...defaultCookieOptions,
    maxAge: 0,
  });

  // Set header
  res.setHeader('Set-Cookie', [sessionCookie, csrfCookie]);

  // Success response
  return res.status(200).json({ message: MSG_LOGOUT_DONE });
};

export const logoutHandler = apiMiddleware(handler, { method: METHOD_POST });
