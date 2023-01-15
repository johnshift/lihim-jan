import jwtDecode from 'jwt-decode';

import type { SupabaseAccessToken } from '../types';

import { decryptSessionCookie } from './session-cipher';

/**
 * `checkIfValidAuthd` checks whether access-token is authenticated and has valid expiry
 * @param accessToken obtained from decrypting token
 * @returns true if authenticated and valid-expiry
 */
const checkIfValidAuthd = (accessToken: string) => {
  // Parse accessToken
  let token: SupabaseAccessToken;
  try {
    token = jwtDecode(accessToken);
  } catch {
    // Token cannot be parsed -> not logged in
    // return anon to indicate not logged in
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const validExp = now < token.exp; // Only valid is exp is in the future
  const authenticated = token.role === 'authenticated';

  return validExp && authenticated;
};

// Returns emptySession if no accessToken or expired
export const getSessionFromCipher = (
  encryptedToken: string | undefined,
  csrf: string | undefined,
) => {
  // Return anonSession if no encrypted token
  if (!encryptedToken || !csrf) {
    return null;
  }

  // Decrypt token into access_token and session
  // If token cannot be decrypted, it automatically throws error
  // catched in handler which then returns as response
  const [accessToken, session, csrfToken] =
    decryptSessionCookie(encryptedToken);

  // Csrf does not match encrypted csrf
  if (csrf !== csrfToken) {
    return null;
  }

  const isValidAuthd = checkIfValidAuthd(accessToken);

  // Only return session if valid + authenticated
  return isValidAuthd ? session : null;
};
