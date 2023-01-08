import { Group, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Brand } from './ui/brand';
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

  return (
    <Wrapper>
      <Brand />
      <Group spacing={5}>
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <Menu
          isOpen={menuIsOpen}
          isLoading={false}
          isLoggedIn={false}
          authFn={() => null}
          onOpen={menuHandlers.open}
          onClose={menuHandlers.close}
        />
      </Group>
    </Wrapper>
  );
};
