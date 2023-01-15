import { NextApiRequest, NextApiResponse } from 'next';

import {
  ERR_LOGIN_INCORRECT,
  LoginPayloadSchema,
  MSG_LOGIN_OK_INFO,
} from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import { ApiError, METHOD_POST } from '@lihim/shared/core';
import { parseObject } from '@lihim/shared/utils';

import { dbLogin } from '../rpcs/db-login';
import { getEmail } from '../rpcs/get-email';
import { getSessionInfo } from '../rpcs/get-session-info';
import { setSessionCookie } from '../utils/set-session-cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate payload
  const payload = parseObject(
    req.body,
    new ApiError(400, ERR_LOGIN_INCORRECT),
    LoginPayloadSchema,
  );

  // Retrieve email (since principal can be username)
  const email = await getEmail(payload.principal);

  // Login in supabase
  const accessToken = await dbLogin(email, payload.password);

  // Retrieve session info
  const session = await getSessionInfo(email);

  // Set session cookie
  setSessionCookie(res, session, accessToken);

  // Success response
  return res.status(200).json({ session, message: MSG_LOGIN_OK_INFO });
};

export const loginHandler = apiMiddleware(handler, { method: METHOD_POST });
