import { ERR_SUFFIX_INVALID, errPhrase, zodString } from '@lihim/shared/core';

import {
  LABEL_USERNAME,
  MAX_LENGTH_PRINCIPAL,
  MIN_LENGTH_PRINCIPAL,
  RGX_USERNAME,
} from '../constants';

export const UsernameSchema = zodString(
  LABEL_USERNAME,
  MIN_LENGTH_PRINCIPAL,
  MAX_LENGTH_PRINCIPAL,
).regex(RGX_USERNAME, errPhrase(LABEL_USERNAME, ERR_SUFFIX_INVALID));
