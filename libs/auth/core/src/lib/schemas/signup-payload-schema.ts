import { z } from 'zod';

import { EmailSchema } from './email-schema';
import { FirstnameSchema, LastnameSchema } from './name-schema';
import { PasswordSchema } from './password-schema';
import { UsernameSchema } from './username-schema';

export const SignupPayloadSchema = z.object({
  firstname: FirstnameSchema,
  lastname: LastnameSchema,
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignupPayload = z.infer<typeof SignupPayloadSchema>;
