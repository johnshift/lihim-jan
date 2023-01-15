import { fakeSession } from '@lihim/auth/testutils';

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
    // Unset env
    process.env['AES_KEY'] = undefined;

    // Provide dummy data
    const accessToken = 'test-token';
    const session = fakeSession();

    // Assert throws error
    expect(async () =>
      encryptSessionCookie(accessToken, session),
    ).rejects.toThrow('encryptSessionCookie missing env: AES_KEY');
  });

  test('decrypt no aesKey throws 500', async () => {
    // Provide dummy data
    const accessToken = 'test-token';
    const session = fakeSession();

    // Encrypt
    const encryptedToken = encryptSessionCookie(accessToken, session);
    if (!encryptedToken) {
      throw new Error('No encrypted token generated');
    }

    // Destructure encryptedToken
    const [sessionToken] = encryptedToken;

    // Unset env
    process.env['AES_KEY'] = undefined;

    // Assert throws error
    expect(async () => decryptSessionCookie(sessionToken)).rejects.toThrow(
      'decryptSessionCookie missing env: AES_KEY',
    );
  });

  test('ok', () => {
    const accessToken = 'test-token';
    const session = fakeSession();

    // Encrypt session cookie
    const [sessionToken, csrfToken] = encryptSessionCookie(
      accessToken,
      session,
    );

    // Decrypt session cookie
    const decryptedToken = decryptSessionCookie(sessionToken);
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
