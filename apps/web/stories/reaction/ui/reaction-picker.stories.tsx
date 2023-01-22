import { Center } from '@mantine/core';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { faker } from '@faker-js/faker';

import { ReactionPicker } from '@lihim/reaction/ui';
import { EmojiKey, emojiMap } from '@lihim/shared/emojis';

export default {
  component: ReactionPicker,
  // Default args
  args: {
    isLoading: false,
    emojiKeys: faker.helpers.arrayElements(
      Object.keys(emojiMap),
      5,
    ) as EmojiKey[],
    onEmojiClick(emoji: string) {
      console.log('emoji =', emoji);
    },
    authFn: (fn: VoidFunction) => () => fn(),
  },
} as ComponentMeta<typeof ReactionPicker>;

const Template: ComponentStory<typeof ReactionPicker> = (args) => (
  <Center sx={{ height: '100vh' }}>
    <ReactionPicker {...args} />
  </Center>
);

export const Default = Template.bind({});
