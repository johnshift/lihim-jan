import { FC } from 'react';

import { Box, Button, Flex } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import type { EmojiKey } from '@lihim/shared/emojis';
import { emojiMap } from '@lihim/shared/emojis';

import { ReactionCount } from './reaction-count';
import { ReactionLoader } from './reaction-loader';

type Props = {
  isLoading: boolean;
  isActive: boolean;
  count: number;
  emojiKey: EmojiKey;
  onClick: VoidFunction;
};

export const ReactionButton: FC<Props> = ({
  isLoading,
  isActive,
  count,
  emojiKey,
  onClick,
}) => {
  // Debounce to trigger count animation
  const [debounced] = useDebouncedValue(count, 60);

  return (
    <Button
      compact
      size="xs"
      radius="xl"
      variant="light"
      styles={(theme) => ({
        root: {
          minHeight: 36,
          minWidth: 90,
          borderColor: isActive
            ? theme.colors['indigo'][theme.colorScheme === 'dark' ? 9 : 3]
            : 'transparent',
        },
      })}
      data-testid={`${emojiKey}-reaction-button`}
      onClick={isLoading ? undefined : onClick}
    >
      <Flex
        justify="space-around"
        sx={{ border: '1px solid none' }}
        gap={10}
        align="center"
      >
        <Box sx={{ border: '1px solid none' }}>{emojiMap[emojiKey]}</Box>
        <Box sx={{ minWidth: 30, border: '1px solid none' }}>
          {isLoading ? (
            <ReactionLoader />
          ) : (
            <ReactionCount
              count={count}
              debounced={debounced}
              isActive={isActive}
            />
          )}
        </Box>
      </Flex>
    </Button>
  );
};
