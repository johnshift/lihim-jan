import { z } from 'zod';

import { SessionSchema } from './session-schema';

export const LoginResponseSchema = z.object({
  message: z.string(),
  session: SessionSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
