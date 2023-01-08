import { renderHook } from '@testing-library/react';

import { useRootContext } from './use-root-context';

describe('useRootContext', () => {
  test('default values', () => {
    const { result } = renderHook(() => useRootContext());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.session.isAnon).toBe(true);
  });
});
