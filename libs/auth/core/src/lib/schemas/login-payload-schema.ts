import { z } from 'zod';

import { EmailSchema } from './email-schema';
import { PasswordSchema } from './password-schema';
import { UsernameSchema } from './username-schema';

export const LoginPayloadSchema = z.object({
  principal: z.union([UsernameSchema, EmailSchema]),
  password: PasswordSchema,
});
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
