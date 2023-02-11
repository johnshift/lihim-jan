import { z } from 'zod';

export const NonNegativeSchema = z.number().nonnegative();
export type NonNegative = z.infer<typeof NonNegativeSchema>;
