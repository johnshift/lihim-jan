import { setupServer } from 'msw/node';

import {
  ERR_LOGOUT_FAILED,
  MSG_LOGOUT_DONE,
  MSG_LOGOUT_LOADING,
  MSG_LOGOUT_OK,
  TESTID_LOGOUT_LOADING,
  TEXT_LOGOUT,
  TEXT_LOGOUT_SUBTITLE,
  TEXT_LOGOUT_TITLE,
} from '@lihim/auth/core';
import {
  fakeSession,
  mockLogoutResponse,
  mockSessionResponse,
} from '@lihim/auth/testutils';
import { ERR_INTERNAL, TEXT_CANCEL, TEXT_LOADING } from '@lihim/shared/core';
import {
  render,
  screen,
  user,
  waitFor,
  waitForElementToBeRemoved,
} from '@lihim/shared/testutils/feature';

import LogoutForm from './logout-form';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

describe('LogoutForm', () => {
  test('defaults', () => {
    // Mock loggedin session
    mswServer.use(mockSessionResponse(200, fakeSession()));

    // Render feature component
    render(<LogoutForm />);

    // Assert visibility
    expect(screen.getByText(TEXT_LOGOUT_TITLE)).toBeVisible();
    expect(screen.getByText(TEXT_LOGOUT_SUBTITLE)).toBeVisible();
    expect(screen.getByRole('button', { name: TEXT_CANCEL })).toBeVisible();
    expect(screen.getByRole('button', { name: TEXT_LOGOUT })).toBeVisible();
  });

  test('loading', async () => {
    mswServer.use(
      // Mock loggedin session
      mockSessionResponse(200, fakeSession()),
      // Mock long running request
      mockLogoutResponse({
        delay: 200,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Render feature component
    render(<LogoutForm />);

    // Click logout
    await user.click(screen.getByRole('button', { name: TEXT_LOGOUT }));

    // Assert loading
    await waitFor(() => {
      expect(screen.getByTestId(TESTID_LOGOUT_LOADING)).toBeVisible();
    });
  });

  test('error', async () => {
    mswServer.use(
      // Mock loggedin session
      mockSessionResponse(200, fakeSession()),
      // Mock long running request
      mockLogoutResponse({
        delay: 200,
        status: 500,
        body: { message: ERR_INTERNAL },
      }),
    );

    // Render feature component
    render(<LogoutForm />);

    // Click logout
    await user.click(screen.getByRole('button', { name: TEXT_LOGOUT }));

    // Wait for loading to finish
    await screen.findByTestId(TESTID_LOGOUT_LOADING);
    await screen.findByText(TEXT_LOADING);
    await screen.findByText(MSG_LOGOUT_LOADING);
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(TESTID_LOGOUT_LOADING),
    );

    // Assert notification
    await screen.findByText(ERR_LOGOUT_FAILED);
    await screen.findByText(ERR_INTERNAL);
  });

  test('success', async () => {
    mswServer.use(
      // Mock loggedin session
      mockSessionResponse(200, fakeSession()),
      // Mock long running request
      mockLogoutResponse({
        delay: 200,
        status: 200,
        body: { message: MSG_LOGOUT_DONE },
      }),
    );

    // Render feature component
    render(<LogoutForm />);

    // Click logout
    await user.click(screen.getByRole('button', { name: TEXT_LOGOUT }));

    // Wait for loading to finish
    await screen.findByTestId(TESTID_LOGOUT_LOADING);
    await screen.findByText(TEXT_LOADING);
    await screen.findByText(MSG_LOGOUT_LOADING);
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(TESTID_LOGOUT_LOADING),
    );

    // Assert notification
    await screen.findByText(MSG_LOGOUT_OK);
    await screen.findByText(MSG_LOGOUT_DONE);
  });
});
