import { z } from 'zod';

import { ERR_INTERNAL, ERR_OFFLINE } from '@lihim/shared/core';

import { FetchError } from './constants';
import { getParsedError } from './get-parsed-error';

describe('getParsedError', () => {
  // Arrange
  const testData = 42;
  const testErrorMsg = 'test-error';
  const testError = new Error(testErrorMsg);

  test('error offline', () => {
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);

    const { message } = getParsedError(testError) as Error;
    expect(message).toBe(ERR_OFFLINE);
  });

  test('fetch-error w/o error-schema', () => {
    const error = new FetchError({ data: testData, message: testErrorMsg });
    expect(getParsedError(error)).toStrictEqual({
      message: testErrorMsg, // Notice data field was omitted since it defaults to generic-response
    });
  });

  test('fetch-error w/ error-schema', () => {
    // Arrange
    const errorData = { data: testData, message: testErrorMsg };
    const errorSchema = z.object({ data: z.number(), message: z.string() });
    const error = new FetchError(errorData);

    // Act
    expect(getParsedError(error, errorSchema)).toStrictEqual(errorData);
  });

  test('fetch-error w/ failed error-schema', () => {
    // Arrange
    const errorData = { data: testData, message: testErrorMsg };
    const errorSchema = z.object({ data: z.number(), message: z.number() }); // Notice message is number
    const error = new FetchError(errorData);

    // Act
    const { message } = getParsedError(error, errorSchema);
    expect(message).toStrictEqual(ERR_INTERNAL);
  });

  test('error with message', () => {
    const error = new Error(testErrorMsg);
    const { message } = getParsedError(error) as Error;
    expect(message).toBe(ERR_INTERNAL);
  });

  test('error defaults to internal-error', () => {
    const error = { data: 42 };
    const { message } = getParsedError(error) as Error;
    expect(message).toBe(ERR_INTERNAL);
  });
});
