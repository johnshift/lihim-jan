import { NextApiRequest, NextApiResponse } from 'next';

import type { SafeParseError } from 'zod';

import type {
  SignupErrorResponse,
  SignupPayload,
  SignupResponse,
} from '@lihim/auth/core';
import { SignupPayloadSchema } from '@lihim/auth/core';
import { apiMiddleware } from '@lihim/shared/api';
import type { GenericResponse } from '@lihim/shared/core';
import { METHOD_POST } from '@lihim/shared/core';

import { dbSignup } from '../rpcs/db-signup';
import { signupPreflight } from '../rpcs/signup-preflight';
import { setSessionCookie } from '../utils/set-session-cookie';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse | SignupErrorResponse | GenericResponse>,
) => {
  // Validate payload
  const parseResult = SignupPayloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    const error = (parseResult as SafeParseError<SignupPayload>).error
      .errors[0];
    return res.status(400).json({
      field: error.path[0] as keyof SignupPayload,
      message: error.message,
    });
  }

  // Validated payload
  const payload = parseResult.data;

  // Check username/email taken
  await signupPreflight(payload);

  // Supabase signup
  const [session, accessToken] = await dbSignup(payload);

  // Set encrypted sesison cookie
  setSessionCookie(res, session, accessToken);

  // Success response
  return res
    .status(200)
    .json({ session, message: `Welcome ${payload.firstname}!` });
};

export const signupHandler = apiMiddleware(handler, { method: METHOD_POST });
