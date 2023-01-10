import { z } from 'zod';

import { GenericResponseSchema } from '@lihim/shared/core';

import { SessionSchema } from './session-schema';

export const LoginResponseSchema = GenericResponseSchema.extend({
  session: SessionSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
