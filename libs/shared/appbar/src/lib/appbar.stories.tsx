import { ComponentProps } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Appbar } from './appbar';

type Props = ComponentProps<typeof Appbar>;

export default {
  component: Appbar,
} as Meta<Props>;

export const Default: StoryObj<Props> = {};
