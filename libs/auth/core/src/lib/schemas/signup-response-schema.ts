import { z } from 'zod';

import { GenericResponseSchema, UndefinedSchema } from '@lihim/shared/core';

import { SessionSchema } from './session-schema';

export const SignupResponseSchema = GenericResponseSchema.extend({
  session: SessionSchema,
});

export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const SignupErrorResponseSchema = GenericResponseSchema.extend({
  field: z.union([
    z.literal('firstname'),
    z.literal('lastname'),
    z.literal('username'),
    z.literal('email'),
    z.literal('password'),
    UndefinedSchema,
  ]),
});

export type SignupErrorResponse = z.infer<typeof SignupErrorResponseSchema>;
