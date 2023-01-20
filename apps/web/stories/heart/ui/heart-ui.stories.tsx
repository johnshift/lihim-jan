import { useReducer } from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { HeartUi } from '@lihim/heart/ui';

export default {
  component: HeartUi,
} as ComponentMeta<typeof HeartUi>;

const Template: ComponentStory<typeof HeartUi> = (args) => {
  const [count, increment] = useReducer((count) => count + 1, 0);

  return (
    <HeartUi count={count} isLoading={args.isLoading} onClick={increment} />
  );
};

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
