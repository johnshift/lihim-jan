import { z } from 'zod';

export const DateSchema = z.date();
export type TDate = z.infer<typeof DateSchema>;
