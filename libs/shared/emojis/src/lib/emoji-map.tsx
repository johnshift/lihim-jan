import type { ReactNode } from 'react';

import { z } from 'zod';

import { EmojiComponent } from './ui/emoji-component';
import { emojiPropsFace } from './ui/emoji-props-faces';
import { emojiPropsFace2 } from './ui/emoji-props-faces-2';
import { emojiPropsHands } from './ui/emoji-props-hands';
import { emojiPropsMisc } from './ui/emoji-props-misc';
import { emojiPropsStatic } from './ui/emoji-props-static';
import { emojiPropsSymbols } from './ui/emoji-props-symbols';

const emojiProps = [
  ...emojiPropsFace,
  ...emojiPropsFace2,
  ...emojiPropsHands,
  ...emojiPropsMisc,
  ...emojiPropsSymbols,
  ...emojiPropsStatic,
];

type EmojiMapKey = typeof emojiProps[number]['key'];
type EmojiMap = Record<EmojiMapKey, ReactNode>;

export const emojiMap = Object.fromEntries(
  emojiProps.map(({ key, alt, src, placeholder }, index) => [
    key,
    <EmojiComponent key={alt} alt={alt} src={src} placeholder={placeholder} />,
  ]),
) as EmojiMap;

export const EmojiKeySchema = z.enum(
  Object.keys(emojiMap) as unknown as readonly [keyof typeof emojiMap],
);

export type EmojiKey = z.infer<typeof EmojiKeySchema>;
