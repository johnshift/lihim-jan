/* eslint-disable camelcase */

import { z } from 'zod';

import {
  ERR_SUFFIX_INVALID,
  ERR_SUFFIX_REQUIRED,
  errPhrase,
} from '@lihim/shared/core';

import { LABEL_EMAIL } from '../constants';

export const EmailSchema = z
  .string({
    required_error: errPhrase(LABEL_EMAIL, ERR_SUFFIX_REQUIRED),
    invalid_type_error: errPhrase(LABEL_EMAIL, ERR_SUFFIX_INVALID),
  })
  .email(errPhrase(LABEL_EMAIL, ERR_SUFFIX_INVALID));
