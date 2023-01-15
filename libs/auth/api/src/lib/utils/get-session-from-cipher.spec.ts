import { faker } from '@faker-js/faker';
import * as jwtDecode from 'jwt-decode';

import { Session } from '@lihim/auth/core';
import { fakeSession } from '@lihim/auth/testutils';
import { TVoidFn } from '@lihim/shared/core';

import { getSessionFromCipher } from './get-session-from-cipher';
import { encryptSessionCookie } from './session-cipher';

type Options = {
  token?: string;
  csrf?: string;
  expected?: Session | null;
  setup?: TVoidFn;
};

type TestCase = [
  string, // Title
  Options,
];

jest.mock('jwt-decode', () => ({
  __esModule: true,
  ...jest.requireActual('jwt-decode'),
}));

describe('getSessionCipher', () => {
  // Mock values
  const testSession = fakeSession();
  const [testToken, testCsrf] = encryptSessionCookie(
    faker.datatype.uuid(),
    testSession,
  );

  const defaultOptions: Options = {
    token: testToken,
    csrf: testCsrf,
    expected: null,
    setup: undefined,
  };

  const testCases: TestCase[] = [
    ['no encrypted-token provided', { token: '' }],
    ['no csrf-token provided', { csrf: '' }],
    ['csrf-token mismatch', { csrf: 'fake-csrf' }],
    [
      'jwt-decode error',
      {
        setup() {
          // Mock jwt-decode error
          jest.spyOn(jwtDecode, 'default').mockImplementationOnce(() => {
            throw new Error('some-error');
          });
        },
      },
    ],
    [
      'expired token',
      {
        setup() {
          // Mock jwt-decode returns expired token
          jest.spyOn(jwtDecode, 'default').mockImplementationOnce(() => ({
            exp: 0,
          }));
        },
      },
    ],
    [
      'not authenticated',
      {
        setup() {
          // Mock jwt-decode returns expired token
          jest.spyOn(jwtDecode, 'default').mockImplementationOnce(() => ({
            exp: 1_956_499_200, // Will expire in 10 years
            role: 'some-role-other-than-authenticated',
          }));
        },
      },
    ],
    [
      'valid and authenticated',
      {
        expected: testSession,
        setup() {
          // Mock jwt-decode returns expired token
          jest.spyOn(jwtDecode, 'default').mockImplementationOnce(() => ({
            exp: 1_956_499_200, // Will expire in 10 years
            role: 'authenticated',
          }));
        },
      },
    ],
  ];

  test.each<TestCase>(testCases)('%s', (_, _options) => {
    // Default options + override fields
    const options = {
      ...defaultOptions,
      ..._options,
    };

    // Run setup if provided
    if (options.setup) {
      options.setup();
    }

    // Exec
    const result = getSessionFromCipher(options.token, options.csrf);

    // Assert
    expect(result).toStrictEqual(options.expected);
  });
});
