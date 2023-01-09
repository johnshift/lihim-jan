import { authTexts } from '@lihim/auth/core';
import { texts } from '@lihim/shared/core';
import { render, screen, user } from '@lihim/shared/testutils/ui';

import { aria, testid } from '../constants';

import { Menu } from './menu';

describe('Menu', () => {
  test('opened', async () => {
    // Arrange props
    const isOpen = true;
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const isLoading = false;
    const isLoggedIn = false;
    const authFn = jest.fn();

    // Render component
    render(
      <Menu
        isOpen={isOpen}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        authFn={authFn}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    // Assert opened (burger shows X with `close` aria label)
    const button = await screen.findByRole('button', {
      name: aria.headerMenu,
    });
    await user.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closed', async () => {
    // Arrange props
    const isOpen = false;
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const isLoading = false;
    const isLoggedIn = false;
    const authFn = jest.fn();

    // Render component
    render(
      <Menu
        isOpen={isOpen}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        authFn={authFn}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    // Assert closed (burger shows menu with `open` aria label)
    const button = await screen.findByRole('button', {
      name: aria.headerMenu,
    });

    // Assert toggle
    await user.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('loading', async () => {
    // Arrange props
    const isOpen = true;
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const isLoading = true;
    const isLoggedIn = false;
    const authFn = jest.fn();

    // Render component
    render(
      <Menu
        isOpen={isOpen}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        authFn={authFn}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    // Assert isLoading
    await screen.findByTestId(testid.headerLoader);
    expect(
      screen.getByRole('menuitem', { name: texts.loading }),
    ).toBeDisabled();
  });

  test('loggedin', async () => {
    // Arrange props
    const isOpen = true;
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const isLoading = false;
    const isLoggedIn = true;
    const authFn = jest.fn();

    // Render component
    render(
      <Menu
        isOpen={isOpen}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        authFn={authFn}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    // Assert loggedin
    await user.click(await screen.findByText(authTexts.logout));
    expect(authFn).toHaveBeenCalledTimes(1);
  });

  test('not loggedin', async () => {
    // Arrange props
    const isOpen = true;
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const isLoading = false;
    const isLoggedIn = false;
    const authFn = jest.fn();

    // Render component
    render(
      <Menu
        isOpen={isOpen}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        authFn={authFn}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    // Assert loggedin
    await user.click(await screen.findByText(authTexts.login));
    expect(authFn).toHaveBeenCalledTimes(1);
  });
});
