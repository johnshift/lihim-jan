import { z } from 'zod';

import { errPhrase, errSuffix, zodString } from '@lihim/shared/core';

import { lengths, regex, subjects } from '../misc';

const genNameSchema = (subject: string) =>
  zodString(subject, lengths.name.min, lengths.name.max) //
    .regex(regex.name, errPhrase(subject, errSuffix.invalid));

export const FirstnameSchema = genNameSchema(subjects.firstname);
export type Firstname = z.infer<typeof FirstnameSchema>;

export const LastnameSchema = genNameSchema(subjects.lastname);
export type Lastname = z.infer<typeof LastnameSchema>;
