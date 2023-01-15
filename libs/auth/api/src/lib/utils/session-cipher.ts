import CryptoJS from 'crypto-js';
import { uid } from 'uid';

import type { Session } from '@lihim/auth/core';
import { ApiError, ERR_INTERNAL } from '@lihim/shared/core';

// EncryptSessionCookie converts accessToken, session object and a csrf token -
// into an encrypted string that will be stored in cookie.
// This way, we only need to decrypt the session cookie (if there's any) -

// and avoid a roundtrip call to db instance.
export const encryptSessionCookie = (
  accessToken: string,
  session: Session,
): [string, string] => {
  // Get aes key from env
  const { AES_KEY } = process.env;
  if (!AES_KEY) {
    console.error('encryptSessionCookie missing env: AES_KEY');
    throw new ApiError(500, ERR_INTERNAL);
  }

  // Generate csrf token
  const csrfToken = uid();

  // Generate session token by encrypting accessToken, session and csrf token
  const sessionToken = CryptoJS.AES.encrypt(
    // Convert to json string for serialization
    JSON.stringify({ accessToken, session, csrfToken }),
    AES_KEY,
  ).toString();

  // Return sessionToken and csrfToken
  return [sessionToken, csrfToken];
};

// DecryptSessionCookie ...
export const decryptSessionCookie = (
  encryptedToken: string,
): [string, Session, string] => {
  // Get aes key from env
  const { AES_KEY } = process.env;
  if (!AES_KEY) {
    console.error('decryptSessionCookie missing env: AES_KEY');
    throw new ApiError(500, ERR_INTERNAL);
  }

  // Decrypt token
  const decrypted = CryptoJS.AES.decrypt(encryptedToken, AES_KEY).toString(
    CryptoJS.enc.Utf8,
  );

  const { accessToken, session, csrfToken } = JSON.parse(decrypted) as {
    accessToken: string;
    session: Session;
    csrfToken: string;
  };

  // Return accessToken, session and csrfToken
  return [accessToken, session, csrfToken];
};
