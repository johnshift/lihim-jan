import { setupServer } from 'msw/node';

import { fakeSession, mockSessionResponse } from '@lihim/auth/testutils';
import { httpErrors } from '@lihim/shared/core';
import {
  renderHook,
  TestWrapper,
  waitFor,
} from '@lihim/shared/testutils/data-access';

import { useSession } from './use-session';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

describe('useSessionQuery', () => {
  test('internal server error', async () => {
    // Mock internal error response
    const body = {
      message: httpErrors.internal,
    };
    mswServer.use(mockSessionResponse(500, body));

    // Render Hook
    const { result } = renderHook(() => useSession(), {
      wrapper: TestWrapper,
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assertions
    expect(result.current.error?.message).toStrictEqual(body.message);
  });

  test('error defaults to not loggedIn', async () => {
    // Mock error response
    const status = 400;
    const body = {
      message: 'Test Error',
    };
    mswServer.use(mockSessionResponse(status, body));

    // Render Hook
    const { result } = renderHook(() => useSession(), {
      wrapper: TestWrapper,
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assertions
    expect(result.current.error?.message).toStrictEqual(body.message);
    expect(result.current.data).toBeUndefined();
  });

  test('loggedIn', async () => {
    // Mock session response
    const body = fakeSession();

    mswServer.use(mockSessionResponse(200, body));

    // Render Hook
    const { result } = renderHook(() => useSession(), {
      wrapper: TestWrapper,
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assertions
    expect(result.current.error).toBeFalsy();
    expect(result.current.data).toStrictEqual(body);
  });
});
