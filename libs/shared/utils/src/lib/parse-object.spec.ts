import { z } from 'zod';

import { parseObject } from './parse-object';

describe('parseObject', () => {
  // Arrange
  const testObject = { id: 'test-id' };
  const testMessage = 'test-message';
  const testError = new Error(testMessage);
  const testSchema = z.object({ id: z.string() });
  const testWrongSchema = z.object({ id: z.number() });

  test('parse error', () => {
    expect(() =>
      parseObject(testObject, testError, testWrongSchema),
    ).toThrowError(testMessage);
  });

  test('parse success', () => {
    expect(parseObject(testObject, testError, testSchema)).toStrictEqual(
      testObject,
    );
  });
});
