/* eslint-disable camelcase */

// Note: These utils are functions used in defining schemas (hence why declared here)

import { z } from 'zod';

import {
  ERR_SUFFIX_INVALID,
  ERR_SUFFIX_LONG,
  ERR_SUFFIX_REQUIRED,
  ERR_SUFFIX_SHORT,
  ErrSuffix,
} from './constants';

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
      required_error: errPhrase(subject, ERR_SUFFIX_REQUIRED),
      invalid_type_error: errPhrase(subject, ERR_SUFFIX_INVALID),
    })
    .min(min, errPhrase(subject, ERR_SUFFIX_SHORT))
    .max(max, errPhrase(subject, ERR_SUFFIX_LONG));
