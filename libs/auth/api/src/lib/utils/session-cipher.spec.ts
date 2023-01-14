import { waitFor } from '@testing-library/react';

import { fakeSession } from '@lihim/auth/testutils';
import { ERR_INTERNAL } from '@lihim/shared/core';

import { decryptSessionCookie, encryptSessionCookie } from './session-cipher';

describe('sessionCookieCipher', () => {
  // Reference env
  const PREV_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...PREV_ENV }; // Make a copy
  });

  afterEach(() => {
    process.env = PREV_ENV; // Restore
  });

  test('encrypt no aesKey throws 500', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Unset env
    process.env['AES_KEY'] = undefined;

    // Provide dummy data
    const accessToken = 'test-token';
    const session = fakeSession();

    // Assert throws error
    expect(encryptSessionCookie(accessToken, session)).rejects.toThrow(
      ERR_INTERNAL,
    );

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'encryptSessionCookie missing env: AES_KEY',
      ),
    );
  });

  test('decrypt no aesKey throws 500', async () => {
    // Spy console.log
    const consoleSpy = jest.spyOn(console, 'error');

    // Provide dummy data
    const accessToken = 'test-token';
    const session = fakeSession();

    // Encrypt
    const encryptedToken = await encryptSessionCookie(accessToken, session);
    if (!encryptedToken) {
      throw new Error('No encrypted token generated');
    }

    // Destructure encryptedToken
    const [sessionToken] = encryptedToken;

    // Unset env
    process.env['AES_KEY'] = undefined;

    // Assert throws error
    expect(decryptSessionCookie(sessionToken)).rejects.toThrow(ERR_INTERNAL);

    // Assert console log
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'decryptSessionCookie missing env: AES_KEY',
      ),
    );
  });

  test('ok', async () => {
    const accessToken = 'test-token';
    const session = fakeSession();

    // Encrypt session cookie
    const [sessionToken, csrfToken] = await encryptSessionCookie(
      accessToken,
      session,
    );

    // Decrypt session cookie
    const decryptedToken = await decryptSessionCookie(sessionToken);
    if (!decryptedToken) {
      throw new Error('No decrypted token generated');
    }

    // Destructure contents of decryptedToken
    const [accessToken2, session2, csrfToken2] = decryptedToken;

    // Assert equal values
    expect(accessToken).toEqual(accessToken2);
    expect(session).toEqual(session2);
    expect(csrfToken).toEqual(csrfToken2);
  });
});
