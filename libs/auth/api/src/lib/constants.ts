import type { CookieSerializeOptions } from 'cookie';

// String literals
export const COOKEY_SESSION = 'LIHIM-SESSION';
export const COOKEY_CSRF = 'LIHIM-CSRF';

// Rpc names
export const RPC_GET_EMAIL = 'get_email';
export const RPC_GET_SESSION_INFO = 'get_session_info';
export const RPC_SIGNUP_PREFLIGHT = 'signup_preflight';

// Errors
export const ERR_EMAIL_TAKEN = 'Email address is already taken';
export const ERR_USERNAME_TAKEN = 'Username is already taken';

// Default cookie options
export const defaultCookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60,
  path: '/',
  sameSite: 'strict',
  secure: process.env['NODE_ENV'] === 'production',
} as CookieSerializeOptions;
