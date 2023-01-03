import { FC, ReactNode, useState } from 'react';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as BaseMantineProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { setCookie } from 'cookies-next';

import { theme } from './theme';

type Props = {
  children: ReactNode;
  colorScheme: ColorScheme;
};

export const MantineProvider: FC<Props> = (props) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme,
  );

  const toggle = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
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
        <NotificationsProvider position="bottom-center" containerWidth={300}>
          {props.children}
        </NotificationsProvider>
      </BaseMantineProvider>
    </ColorSchemeProvider>
  );
};
