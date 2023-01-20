import { FC, useState } from 'react';

import { Box } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import { useLottie } from 'lottie-react';

import heartAnimation from './heart.json';
import { HeartCount } from './heart-count';
import { HeartCountWrapper } from './heart-count-wrapper';
import { HeartIcon } from './heart-icon';

type Props = {
  count: number;
  isLoading: boolean;
  onClick: VoidFunction;
};

const useHeartLottie = (clicked: boolean) =>
  useLottie(
    {
      loop: false,
      animationData: heartAnimation,

      // Do not animate heart on initial load
      initialSegment: clicked ? [0, 36] : [36, 36],
    },
    {
      padding: 0,
      height: 100,
      width: 100,
    },
  );

export const HeartUi: FC<Props> = (props) => {
  // Debounce to trigger count transition
  const [debounced] = useDebouncedValue(props.count, 60);

  // Animation
  const [clicked, setClicked] = useState(false);
  const { View, goToAndPlay, stop } = useHeartLottie(clicked);

  const onClick = () => {
    // Control initial segment
    if (!clicked) {
      setClicked(true);
    }

    // Run animation
    stop();
    goToAndPlay(10, true);

    // Run parent onClick handler
    props.onClick();
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 36 }}>
      <HeartIcon icon={View} />
      <HeartCountWrapper isLoading={props.isLoading} onClick={onClick}>
        <HeartCount count={props.count} debounced={debounced} />
      </HeartCountWrapper>
    </Box>
  );
};
