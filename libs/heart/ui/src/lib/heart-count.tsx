import { FC } from 'react';

import { Text, Transition } from '@mantine/core';

import { numFormatter } from '@lihim/shared/core';

type Props = {
  count: number;
  debounced: number;
};

/**
 * HeartCount renders the current heart count.
 * It uses debounced value to decide whether to animate the count.
 */
export const HeartCount: FC<Props> = ({ count, debounced }) => (
  <Transition
    mounted={count === debounced}
    transition="skew-up"
    duration={300}
    timingFunction="ease"
  >
    {(styles) => (
      <div style={{ ...styles, display: 'flex' }}>
        <Text size={15} color="dimmed" sx={{ userSelect: 'none' }}>
          {count > 9999 ? numFormatter.format(count) : count}
        </Text>
      </div>
    )}
  </Transition>
);
