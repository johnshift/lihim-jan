import { z } from 'zod';

/**
 * Parses an object using zod-schema
 * @param obj object to be parsed
 * @param error error object thrown when parse failed
 * @param schema zod schema to be checked
 * @returns parsed object
 */
export const parseObject = <T>(
  obj: unknown,
  error: Record<string, unknown> | Error,
  schema: z.ZodType<T>,
) => {
  const result = schema.safeParse(obj);
  if (!result.success) {
    throw error;
  }

  return result.data;
};
