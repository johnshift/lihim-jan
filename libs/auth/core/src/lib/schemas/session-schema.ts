import { z } from 'zod';

import { EmailSchema } from './email-schema';
import { FirstnameSchema, LastnameSchema } from './name-schema';
import { UsernameSchema } from './username-schema';

export const SessionSchema = z.discriminatedUnion('isAnon', [
  z.object({ isAnon: z.literal(true) }),
  z.object({
    id: z.string().uuid(),
    avatar: z.string(),
    email: EmailSchema,
    username: UsernameSchema,
    firstname: FirstnameSchema,
    lastname: LastnameSchema,
    bio: z.optional(z.string()),
    isAnon: z.literal(false),
  }),
]);

export type Session = z.infer<typeof SessionSchema>;
