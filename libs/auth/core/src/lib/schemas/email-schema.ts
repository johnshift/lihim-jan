/* eslint-disable camelcase */

import { z } from 'zod';

import {
  ERR_SUFFIX_INVALID,
  ERR_SUFFIX_REQUIRED,
  errPhrase,
} from '@lihim/shared/core';

import { subjects } from '../misc';

export const EmailSchema = z
  .string({
    required_error: errPhrase(subjects.email, ERR_SUFFIX_REQUIRED),
    invalid_type_error: errPhrase(subjects.email, ERR_SUFFIX_INVALID),
  })
  .email(errPhrase(subjects.email, ERR_SUFFIX_INVALID));
