import * as nextRouter from 'next/router';

import * as mantineNotifications from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import { setupServer } from 'msw/node';

import { authMsg, SignupErrorResponse } from '@lihim/auth/core';
import { authErrMsg } from '@lihim/auth/core';
import {
  fakeSession,
  fakeSignupPayload,
  mockSignupResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL } from '@lihim/shared/core';
import {
  act,
  renderHook,
  TestWrapper,
  waitFor,
} from '@lihim/shared/testutils/data-access';

import { useSignupMutation } from './use-signup-mutation';

// Mock mantine notification with actual for spy
jest.mock('@mantine/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/notifications'),
}));

// Mock next router
jest.mock('next/router', () => ({
  __esModule: true,
  ...jest.requireActual('next/router'),
}));

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

describe('useSignupMutation', () => {
  // Mock payload
  const mockPayload = fakeSignupPayload();

  test('error', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Mock error response
    const mockErrorMessage = authErrMsg.signupFailed;
    const body: SignupErrorResponse = {
      message: mockErrorMessage,
      field: 'username' as const,
    };
    mswServer.use(mockSignupResponse({ status: 401, body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useSignupMutation(closeModal), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate(mockPayload);
    });

    // Assert error message
    await waitFor(() => {
      expect(result.current.error?.message).toBe(mockErrorMessage);
    });

    // Assert router
    expect(push).toHaveBeenCalledTimes(0);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.signupFailed,
        message: body.message,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('network error', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Mock network error response
    mswServer.use(mockSignupResponse({ networkError: true }));

    // Mock payload
    const mockPayload = fakeSignupPayload();

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useSignupMutation(closeModal), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate(mockPayload);
    });

    // Assert error message
    await waitFor(() => {
      expect(result.current.error?.message).toBe(ERR_INTERNAL);
    });

    // Assert router
    expect(push).toHaveBeenCalledTimes(0);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.signupFailed,
        message: ERR_INTERNAL,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('success', async () => {
    // Spy on mantine notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Spy on next router
    const push = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push } as any);

    // Mock success response
    const mockSession = fakeSession();
    const body = {
      message: authMsg.signupOk,
      session: mockSession,
    };
    mswServer.use(mockSignupResponse({ body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useSignupMutation(closeModal), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate(mockPayload);
    });

    // Assert no error message
    await waitFor(() => {
      expect(result.current.data).toStrictEqual(body);
    });
    expect(result.current.error).toBeFalsy();

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authMsg.signupOk,
        message: body.message,
        color: 'green',
        icon: <BsCheckCircle />,
      }),
    );

    // Assert router push
    expect(push).toHaveBeenCalledWith('/');

    // Assert modal closed
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
