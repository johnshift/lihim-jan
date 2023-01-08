/* eslint-disable camelcase */

// Note: These utils are functions used in defining schemas (hence why declared here)

import { z } from 'zod';

import { ErrSuffix, errSuffix } from './misc';

/**
 * Describes the `subject` with the provided `suffix`.
 * @param subject Subject of the error phrase
 * @param suffix Text describing the subject
 * @returns {string}
 */
export const errPhrase = (subject: string, suffix: ErrSuffix) =>
  `${subject} ${suffix}`;

/**
 * Returns a zod string with predefined min, max, required and invalid rules
 * @param subject Subject for errors
 * @param min Minimum length of string
 * @param max Maximum length of string
 * @returns zod string
 */
export const zodString = (subject: string, min: number, max: number) =>
  z
    .string({
      required_error: errPhrase(subject, errSuffix.required),
      invalid_type_error: errPhrase(subject, errSuffix.invalid),
    })
    .min(min, errPhrase(subject, errSuffix.short))
    .max(max, errPhrase(subject, errSuffix.long));
