import { z } from 'zod';

export const GenericResponseSchema = z.object({
  message: z.string(),
});

export type GenericResponse = z.infer<typeof GenericResponseSchema>;
