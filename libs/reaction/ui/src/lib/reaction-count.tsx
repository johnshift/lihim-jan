import { FC } from 'react';

import { Text, Transition } from '@mantine/core';

import { numFormatter } from '@lihim/shared/core';

type Props = {
  count: number;
  debounced: number;
  isActive: boolean;
};

export const ReactionCount: FC<Props> = ({ count, debounced, isActive }) => (
  <Transition
    mounted={count === debounced}
    transition="skew-up"
    duration={300}
    timingFunction="ease"
  >
    {(styles) => (
      <div style={{ ...styles, display: 'flex' }}>
        {/* Color dimmed when not active */}
        <Text size="sm" color={isActive ? undefined : 'dimmed'}>
          {count > 9999 ? numFormatter.format(count) : count}
        </Text>
      </div>
    )}
  </Transition>
);
