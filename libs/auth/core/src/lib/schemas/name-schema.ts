import { z } from 'zod';

import { ERR_SUFFIX_INVALID, errPhrase, zodString } from '@lihim/shared/core';

import {
  LABEL_FIRSTNAME,
  LABEL_LASTNAME,
  MAX_LENGTH_NAME,
  MIN_LENGTH_NAME,
  RGX_NAME,
} from '../constants';

const genNameSchema = (subject: string) =>
  zodString(subject, MIN_LENGTH_NAME, MAX_LENGTH_NAME) //
    .regex(RGX_NAME, errPhrase(subject, ERR_SUFFIX_INVALID));

export const FirstnameSchema = genNameSchema(LABEL_FIRSTNAME);
export type Firstname = z.infer<typeof FirstnameSchema>;

export const LastnameSchema = genNameSchema(LABEL_LASTNAME);
export type Lastname = z.infer<typeof LastnameSchema>;
