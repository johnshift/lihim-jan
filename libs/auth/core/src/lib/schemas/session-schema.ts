import { z } from 'zod';

import { EmailSchema } from './email-schema';
import { FirstnameSchema, LastnameSchema } from './name-schema';
import { UsernameSchema } from './username-schema';

const AnonSessionSchema = z.object({
  isAnon: z.literal(true),
});

export type AnonSession = z.infer<typeof AnonSessionSchema>;

const LoggedInSessionSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string(),
  email: EmailSchema,
  username: UsernameSchema,
  firstname: FirstnameSchema,
  lastname: LastnameSchema,
  bio: z.optional(z.string()),
  isAnon: z.literal(false),
});

export type LoggedInSession = z.infer<typeof LoggedInSessionSchema>;

export const SessionSchema = z.discriminatedUnion('isAnon', [
  AnonSessionSchema,
  LoggedInSessionSchema,
]);

export type Session = z.infer<typeof SessionSchema>;
