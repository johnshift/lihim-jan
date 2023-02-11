import { z } from 'zod';

import { UsernameSchema } from '@lihim/auth/core';
import { DateSchema, NonNegativeSchema } from '@lihim/shared/core';
import { EmojiKeySchema } from '@lihim/shared/emojis';

import { PostTitleSchema } from './post-title-schema';

export const PostItemSchema = z.object({
  id: z.string(),
  created: z.union([DateSchema, z.string()]),
  username: UsernameSchema,
  title: PostTitleSchema,
  body: z.string(),
  hearts: NonNegativeSchema,
  heartsUser: NonNegativeSchema,
  emojiKeys: z.array(EmojiKeySchema),
  emojiCounts: z.array(NonNegativeSchema),
  emojiCountsUser: z.array(NonNegativeSchema),
});

export type PostItem = z.infer<typeof PostItemSchema>;
