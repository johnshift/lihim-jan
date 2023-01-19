import { Box, Group, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useLogoutMutation } from '@lihim/auth/data-access';
import { useRootContext } from '@lihim/shared/data-access';

import { Menu } from './ui/menu';
import { ThemeToggle } from './ui/theme-toggle';
import { Wrapper } from './ui/wrapper';

export const Appbar = () => {
  // Theme controls
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const toggleTheme = () => toggleColorScheme();
  const isDark = colorScheme === 'dark';

  // Menu controls
  const [menuIsOpen, menuHandlers] = useDisclosure(false);

  // Session state
  const {
    isLoading: sessionIsLoading,
    authModalActions,
    session,
  } = useRootContext();

  // Logout mutation
  const { isLoading: logoutIsLoading, mutate: logoutMutate } =
    useLogoutMutation();

  // Computed vars
  const isLoggedIn = !session.isAnon;
  const isLoading = sessionIsLoading || logoutIsLoading;
  const authFn = isLoggedIn ? logoutMutate : authModalActions.openLogin;

  return (
    <Wrapper>
      <Box h={50} />
      <Group spacing={0}>
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <Menu
          isOpen={menuIsOpen}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          authFn={authFn}
          onOpen={menuHandlers.open}
          onClose={menuHandlers.close}
        />
      </Group>
    </Wrapper>
  );
};
