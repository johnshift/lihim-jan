import { z } from 'zod';

import { ERR_SUFFIX_INVALID, errPhrase, zodString } from '@lihim/shared/core';

import { LABEL_FIRSTNAME, LABEL_LASTNAME } from '../constants';
import { lengths, regex } from '../misc';

const genNameSchema = (subject: string) =>
  zodString(subject, lengths.name.min, lengths.name.max) //
    .regex(regex.name, errPhrase(subject, ERR_SUFFIX_INVALID));

export const FirstnameSchema = genNameSchema(LABEL_FIRSTNAME);
export type Firstname = z.infer<typeof FirstnameSchema>;

export const LastnameSchema = genNameSchema(LABEL_LASTNAME);
export type Lastname = z.infer<typeof LastnameSchema>;
