import { z } from 'zod';

export const UndefinedSchema = z.undefined();
export type Undefined = z.infer<typeof UndefinedSchema>;
