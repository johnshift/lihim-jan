import { FC, useMemo, useState } from 'react';

import {
  ActionIcon,
  Button,
  Center,
  Popover,
  ScrollArea,
  SimpleGrid,
} from '@mantine/core';
import { FaKissWinkHeart } from 'react-icons/fa';

import { EmojiKey, emojiMap } from '@lihim/shared/emojis';

type Props = {
  isLoading: boolean;
  emojiKeys: EmojiKey[];
  onEmojiClick: (_: EmojiKey) => void;

  /** AuthFn only runs "fn" when user is logged in, otherwise it opens auth-modal */
  authFn: (fn: VoidFunction) => VoidFunction;
};

export const ReactionPicker: FC<Props> = ({
  isLoading,
  emojiKeys,
  onEmojiClick,
  authFn,
}) => {
  // Picker controls
  const [isOpen, setIsOpen] = useState(false);

  // Only show emojis not already included
  const emojis = useMemo(
    () =>
      Object.keys(emojiMap).filter(
        (key) => !emojiKeys.includes(key as EmojiKey),
      ),
    [emojiKeys],
  ) as EmojiKey[];

  // Run onEmojiClick then close popover after click
  const onClick = (emojiKey: EmojiKey) => {
    onEmojiClick(emojiKey);
    setIsOpen(false);
  };

  return (
    <Popover
      opened={isOpen}
      width={300}
      position="bottom"
      shadow="md"
      transitionDuration={0}
      onChange={setIsOpen}
    >
      <Popover.Target>
        <Button
          loading={isLoading}
          loaderProps={{ c: 'gray', size: 'xs' }}
          variant="subtle"
          color="gray"
          leftIcon={<FaKissWinkHeart size={22} />}
          aria-label="reaction-picker"
          onClick={authFn(() => setIsOpen((prev) => !prev))}
        >
          React
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea
          offsetScrollbars
          type="always"
          style={{ height: 280 }}
          pr={5}
        >
          <SimpleGrid cols={4}>
            {emojis.map((key) => (
              <Center key={key}>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="indigo"
                  aria-label={`pick ${key}`}
                  onClick={() => onClick(key)}
                >
                  {emojiMap[key]}
                </ActionIcon>
              </Center>
            ))}
          </SimpleGrid>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );
};
