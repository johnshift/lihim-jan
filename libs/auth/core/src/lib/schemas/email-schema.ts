/* eslint-disable camelcase */

import { z } from 'zod';

import { errPhrase, errSuffix } from '@lihim/shared/core';

import { subjects } from '../misc';

export const EmailSchema = z
  .string({
    required_error: errPhrase(subjects.email, errSuffix.required),
    invalid_type_error: errPhrase(subjects.email, errSuffix.invalid),
  })
  .email(errPhrase(subjects.email, errSuffix.invalid));
