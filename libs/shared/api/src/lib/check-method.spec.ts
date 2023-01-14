import { ERR_METHOD } from '@lihim/shared/core';

import { checkMethod } from './check-method';

describe('check-method handler util', () => {
  it('throws error on mismatch', () => {
    expect(() => checkMethod('GET', 'POST')).toThrowError(ERR_METHOD);
  });

  it('does not throw error on match', () => {
    expect(() => checkMethod('GET', 'GET')).not.toThrowError(ERR_METHOD);
  });
});
