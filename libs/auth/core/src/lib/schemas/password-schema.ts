import { zodString } from '@lihim/shared/core';

import { lengths, subjects } from '../misc';

export const PasswordSchema = zodString(
  subjects.password,
  lengths.password.min,
  lengths.password.max,
);
