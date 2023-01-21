import { useEffect, useReducer } from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ReactionButton } from '@lihim/reaction/ui';
import { EMOJI_KEY_COMET, EmojiKey } from '@lihim/shared/emojis';

export default {
  component: ReactionButton,
} as ComponentMeta<typeof ReactionButton>;

type Props = {
  emojiKey: EmojiKey;
  isLoading?: boolean;
  isActive?: boolean;
};

const Wrapper = (props: Props) => {
  const [count, increment] = useReducer((c) => c + 1, 100);
  const [isLoading, toggleIsLoading] = useReducer((b) => !b, true);

  useEffect(() => {
    const timeout = setTimeout(toggleIsLoading, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ReactionButton
      isLoading={isLoading || props.isLoading}
      isActive={props.isActive}
      emojiKey={props.emojiKey}
      count={count}
      onClick={increment}
    />
  );
};

const Template: ComponentStory<typeof ReactionButton> = (args) => (
  <Wrapper {...args} />
);

export const Default = Template.bind({});
Default.args = {
  emojiKey: EMOJI_KEY_COMET,
};

export const Active = Template.bind({});
Active.args = {
  emojiKey: EMOJI_KEY_COMET,
  isActive: true,
};
