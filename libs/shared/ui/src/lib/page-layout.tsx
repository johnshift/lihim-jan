import { FC, ReactNode } from 'react';

import { Center, createStyles, useMantineTheme } from '@mantine/core';

type StyleParam = {
  borderColor: string;
};

const useStyles = createStyles<string, StyleParam>(
  (theme, { borderColor }) => ({
    container: {
      display: 'flex',
      width: '100vw',
      [theme.fn.largerThan(theme.breakpoints.xs)]: {
        width: '95%',
      },
      [theme.fn.largerThan(theme.breakpoints.md)]: {
        width: '80%',
      },
      [theme.fn.largerThan(theme.breakpoints.lg)]: {
        width: '70%',
      },
    },
    navWrapper: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      [theme.fn.largerThan(theme.breakpoints.xs)]: {
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexBasis: '16.67%', // 2/12
      },
      [theme.fn.largerThan(theme.breakpoints.md)]: {
        flexBasis: '25%',
        paddingLeft: '11%',
      },
    },
    mainWrapper: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      borderLeft: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      [theme.fn.largerThan(theme.breakpoints.xs)]: {
        flexGrow: 1,
      },
      [theme.fn.largerThan(theme.breakpoints.md)]: {
        flexBasis: '50%',
      },
    },
    contentWrapper: {
      minHeight: '400vh', // Temporary
      padding: '10px 10px 0',
    },
    asideWrapper: {
      display: 'none',
      flexDirection: 'column',
      [theme.fn.largerThan(theme.breakpoints.xs)]: {
        display: 'flex',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexBasis: '16.67%', // 2/12
      },
      [theme.fn.largerThan(theme.breakpoints.md)]: {
        flexBasis: '25%',
      },
    },
  }),
);

type Props = {
  children: ReactNode;
  nav: ReactNode;
  appbar: ReactNode;
};

export const PageLayout: FC<Props> = ({ nav, appbar, children }) => {
  const { colorScheme, colors } = useMantineTheme();

  const { classes } = useStyles({
    borderColor: colorScheme === 'dark' ? colors.dark[5] : colors.gray[3],
  });

  return (
    <Center>
      <div className={classes.container}>
        <nav className={classes.navWrapper}>{nav}</nav>
        <main className={classes.mainWrapper}>
          {appbar}
          <div className={classes.contentWrapper}>{children}</div>
        </main>
        <aside className={classes.asideWrapper}>
          <Center>
            <h1>Aside</h1>
          </Center>
        </aside>
      </div>
    </Center>
  );
};
