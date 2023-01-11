import { zodString } from '@lihim/shared/core';

import {
  LABEL_PASSWORD,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
} from '../constants';

export const PasswordSchema = zodString(
  LABEL_PASSWORD,
  MIN_LENGTH_PASSWORD,
  MAX_LENGTH_PASSWORD,
);
