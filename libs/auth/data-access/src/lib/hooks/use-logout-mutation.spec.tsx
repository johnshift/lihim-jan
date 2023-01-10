import * as mantineNotifications from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import { setupServer } from 'msw/node';

import { authErrMsg, authMsg } from '@lihim/auth/core';
import { mockLogoutResponse } from '@lihim/auth/testutils';
import { httpErrors } from '@lihim/shared/core';
import {
  act,
  renderHook,
  TestWrapper,
  waitFor,
} from '@lihim/shared/testutils/data-access';

import { useLogoutMutation } from './use-logout-mutation';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

// Mock mantine notification with actual for spy
jest.mock('@mantine/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/notifications'),
}));

describe('useLogoutMutation', () => {
  test('error', async () => {
    // Spy on mantine notifications
    const showNotifSpy = jest.spyOn(mantineNotifications, 'showNotification');
    const updateNotifSpy = jest.spyOn(
      mantineNotifications,
      'updateNotification',
    );

    // Mock error response
    const mockErrorMessage = httpErrors.internal;
    const body = {
      message: mockErrorMessage,
    };
    mswServer.use(mockLogoutResponse({ status: 400, body }));

    // Render Hook
    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate();
    });

    // Assert error message
    await waitFor(() => {
      expect(result.current.error?.message).toBe(mockErrorMessage);
    });

    // Assert notification
    expect(showNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Loading',
        loading: true,
        message: authMsg.logoutLoading,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.logoutFailed,
        message: mockErrorMessage,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('network error', async () => {
    // Spy on mantine notifications
    const showNotifSpy = jest.spyOn(mantineNotifications, 'showNotification');
    const updateNotifSpy = jest.spyOn(
      mantineNotifications,
      'updateNotification',
    );

    // Mock network error response
    mswServer.use(mockLogoutResponse({ networkError: true }));

    // Render Hook
    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate();
    });

    // Assert error message
    await waitFor(() => {
      expect(result.current.error?.message).toBe(httpErrors.internal);
    });

    // Assert notification
    expect(showNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Loading',
        loading: true,
        message: authMsg.logoutLoading,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: authErrMsg.logoutFailed,
        message: httpErrors.internal,
        color: 'red',
        icon: <BsExclamationCircle />,
      }),
    );
  });

  test('success', async () => {
    // Spy on mantine notifications
    const showNotifSpy = jest.spyOn(mantineNotifications, 'showNotification');
    const updateNotifSpy = jest.spyOn(
      mantineNotifications,
      'updateNotification',
    );

    // Mock success response
    const body = {
      message: 'OK',
    };
    mswServer.use(mockLogoutResponse({ body }));

    // Render Hook
    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: TestWrapper,
    });

    // Mutate
    await act(async () => {
      result.current.mutate();
    });

    // Assert no error message
    await waitFor(() => {
      expect(result.current.data).toStrictEqual(body);
    });
    expect(result.current.error).toBeFalsy();

    // Assert notification
    expect(showNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Loading',
        loading: true,
        message: authMsg.logoutLoading,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'green',
        title: authMsg.logoutOk,
        message: authMsg.logoutDone,
        icon: <BsCheckCircle />,
        autoClose: 4000,
      }),
    );
  });
});
