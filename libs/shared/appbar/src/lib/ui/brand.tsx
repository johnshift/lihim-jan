import NextLink from 'next/link';

import { Anchor } from '@mantine/core';

import { texts } from '@lihim/shared/core';

export const Brand = () => (
  <Anchor
    href="/"
    component={NextLink}
    size={30}
    weight="bold"
    variant="text"
    underline={false}
  >
    {texts.brand}
  </Anchor>
);
