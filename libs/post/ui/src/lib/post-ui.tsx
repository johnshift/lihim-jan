import { FC, ReactNode } from 'react';

import { Stack } from '@mantine/core';

import type { PostItem } from '@lihim/post/core';

import { PostActions } from './post-actions';
import { PostBody } from './post-body';
import { PostReactionList } from './post-reaction-list';
import { PostTitle } from './post-title';

type Props = {
  data: PostItem;
  heart: ReactNode;
  reactions: ReactNode;
  reactionPicker: ReactNode;
};

export const PostUi: FC<Props> = ({
  data,
  heart,
  reactions,
  reactionPicker,
}) => (
  <Stack spacing="xs" p={20} sx={{ width: 'clamp(320px, 98%, 600px)' }}>
    <PostTitle title={data.title} />
    <PostBody body={data.body} />
    <PostReactionList>{reactions}</PostReactionList>
    <PostActions heart={heart} reactionPicker={reactionPicker} />
    {/** TODO: Comment Form */}
    {/** TODO: Divider */}
    {/** TODO: Post comments */}
  </Stack>
);
