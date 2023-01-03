import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  breakpoints: {
    // Base -> phones, xs-landscape -> 0..700
    // largerThan(xs) -> tab, hd-xs-landscape -> 700..850
    // largerThan(sm) -> hd-tab, small-laptop -> 800..1200
    // largerThan(md) -> common screen -> 1200..1500
    // largerThan(lg) -> hd screens -> 1500..2000
    // largerThan(xl) -> ultra hd -> 2000...
    xs: 600,
    sm: 830,
    md: 1200,
    lg: 1540,
    xl: 1930,
  },
};
