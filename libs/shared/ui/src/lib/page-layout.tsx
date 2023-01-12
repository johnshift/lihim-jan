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
      minHeight: '400vh',
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
      },
    },
    contentWrapper: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      [theme.fn.largerThan(theme.breakpoints.xs)]: {
        flexGrow: 1,
        borderLeft: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
      },
      [theme.fn.largerThan(theme.breakpoints.md)]: {
        flexBasis: '50%',
      },
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

export const PageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { colorScheme, colors } = useMantineTheme();

  const { classes } = useStyles({
    borderColor: colorScheme === 'dark' ? colors.dark[5] : colors.gray[2],
  });

  return (
    <Center>
      <div className={classes.container}>
        <div className={classes.navWrapper}>
          <Center>
            <h1>Nav</h1>
          </Center>
        </div>
        <div className={classes.contentWrapper}>{children}</div>
        <div className={classes.asideWrapper}>
          <Center>
            <h1>Aside</h1>
          </Center>
        </div>
      </div>
    </Center>
  );
};
