import * as mantineNotifications from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import { setupServer } from 'msw/node';

import {
  ERR_LOGOUT_FAILED,
  MSG_LOGOUT_DONE,
  MSG_LOGOUT_LOADING,
  MSG_LOGOUT_OK,
} from '@lihim/auth/core';
import { mockLogoutResponse } from '@lihim/auth/testutils';
import { ERR_INTERNAL } from '@lihim/shared/core';
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
    const mockErrorMessage = ERR_INTERNAL;
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
        message: MSG_LOGOUT_LOADING,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: ERR_LOGOUT_FAILED,
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
      expect(result.current.error?.message).toBe(ERR_INTERNAL);
    });

    // Assert notification
    expect(showNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Loading',
        loading: true,
        message: MSG_LOGOUT_LOADING,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: ERR_LOGOUT_FAILED,
        message: ERR_INTERNAL,
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
        message: MSG_LOGOUT_LOADING,
        autoClose: false,
        disallowClose: true,
        color: 'blue',
      }),
    );
    expect(updateNotifSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'green',
        title: MSG_LOGOUT_OK,
        message: MSG_LOGOUT_DONE,
        icon: <BsCheckCircle />,
        autoClose: 4000,
      }),
    );
  });
});
