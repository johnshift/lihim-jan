import { zodString } from '@lihim/shared/core';

import { LABEL_PASSWORD } from '../constants';
import { lengths } from '../misc';

export const PasswordSchema = zodString(
  LABEL_PASSWORD,
  lengths.password.min,
  lengths.password.max,
);
