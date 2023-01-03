import { FC, ReactNode, useEffect, useState } from 'react';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as BaseMantineProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { theme } from './theme';

type Props = {
  children: ReactNode;
  colorScheme?: ColorScheme;
};

export const MantineProvider: FC<Props> = (props) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  // Used to sync theme based from external sources outside of react
  // e.g. storybook theme toggle
  useEffect(() => {
    if (props.colorScheme) {
      setColorScheme(props.colorScheme);
    }
  }, [props.colorScheme]);

  const toggle = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggle}>
      <BaseMantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          ...theme,
        }}
      >
        <NotificationsProvider position="bottom-center" containerWidth={280}>
          {props.children}
        </NotificationsProvider>
      </BaseMantineProvider>
    </ColorSchemeProvider>
  );
};
