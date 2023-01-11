import * as mantineNotifications from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import { setupServer } from 'msw/node';

import { authErrMsg, MSG_LOGIN_OK } from '@lihim/auth/core';
import {
  fakeLoginPayload,
  fakeSession,
  mockLoginResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL, ERR_INVALID_REQUEST } from '@lihim/shared/core';
import {
  act,
  renderHook,
  TestWrapper,
  waitFor,
} from '@lihim/shared/testutils/data-access';

import { useLoginMutation } from './use-login-mutation';

// Mock mantine notification with actual for spy
jest.mock('@mantine/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/notifications'),
}));

describe('use-signin-mutation', () => {
  // Mock payload
  const mockPayload = fakeLoginPayload(false);
  const mockPayloadEmail = fakeLoginPayload();

  // Setup msw server
  const mswServer = setupServer();
  beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => mswServer.close());
  afterEach(() => mswServer.resetHandlers());

  test('invalid zod-schema', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Mock error response
    const mockErrorMessage = ERR_INVALID_REQUEST;
    const body = {
      message: mockErrorMessage,
    };
    mswServer.use(mockLoginResponse({ status: 401, body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useLoginMutation(closeModal), {
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

    // Assert closeModal was not called
    expect(closeModal).toHaveBeenCalledTimes(0);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'red',
        icon: <BsExclamationCircle />,
        title: authErrMsg.loginFailed,
        message: authErrMsg.loginIncorrect,
      }),
    );
  });

  test('api error', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Mock error response
    const mockErrorMessage = authErrMsg.loginIncorrect;
    const body = {
      message: mockErrorMessage,
    };
    mswServer.use(mockLoginResponse({ status: 401, body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useLoginMutation(closeModal), {
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

    // Assert closeModal was not called
    expect(closeModal).toHaveBeenCalledTimes(0);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.loginFailed,
        message: authErrMsg.loginIncorrect,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('network error', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Mock network error response
    mswServer.use(mockLoginResponse({ networkError: true }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useLoginMutation(closeModal), {
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

    // Assert closeModal was not called
    expect(closeModal).toHaveBeenCalledTimes(0);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.loginFailed,
        message: authErrMsg.loginIncorrect,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('success username', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Mock success response
    const mockSession = fakeSession();
    const body = {
      message: MSG_LOGIN_OK,
      session: mockSession,
    };
    mswServer.use(mockLoginResponse({ body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useLoginMutation(closeModal), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate(mockPayload);
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert no error message
    await waitFor(() => {
      expect(result.current.data).toStrictEqual(body);
    });
    expect(result.current.error).toBeFalsy();

    // Assert closeModal was called
    expect(closeModal).toHaveBeenCalledTimes(1);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: MSG_LOGIN_OK,
        message: body.message,
        color: 'green',
        icon: <BsCheckCircle />,
      }),
    );
  });

  test('success email', async () => {
    // Spy on mantin notifications
    const notifSpy = jest.spyOn(mantineNotifications, 'updateNotification');

    // Mock success response
    const mockSession = fakeSession();
    const body = {
      message: MSG_LOGIN_OK,
      session: mockSession,
    };
    mswServer.use(mockLoginResponse({ body }));

    // Render Hook
    const closeModal = jest.fn();
    const { result } = renderHook(() => useLoginMutation(closeModal), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate(mockPayloadEmail);
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert no error message
    await waitFor(() => {
      expect(result.current.data).toStrictEqual(body);
    });
    expect(result.current.error).toBeFalsy();

    // Assert closeModal was called
    expect(closeModal).toHaveBeenCalledTimes(1);

    // Assert notification
    expect(notifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: MSG_LOGIN_OK,
        message: body.message,
        color: 'green',
        icon: <BsCheckCircle />,
      }),
    );
  });
});
