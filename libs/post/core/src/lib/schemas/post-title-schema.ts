import { z } from 'zod';

import {
  ERR_POST_TITLE_LONG,
  ERR_POST_TITLE_REQUIRED,
  MAX_LENGTH_POST_TITLE,
} from '../constants';

export const PostTitleSchema = z
  .string()
  .min(1, { message: ERR_POST_TITLE_REQUIRED })
  .max(MAX_LENGTH_POST_TITLE, { message: ERR_POST_TITLE_LONG });

export type PostTitle = z.infer<typeof PostTitleSchema>;
