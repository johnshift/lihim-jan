import { FC, ReactNode, useState } from 'react';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as BaseMantineProvider,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';

import { theme } from './theme';

type Props = {
  children: ReactNode;
  colorScheme?: ColorScheme;
};

export const MantineProvider: FC<Props> = (props) => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme ?? preferredColorScheme,
  );

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
