import { ERR_SUFFIX_INVALID, errPhrase, zodString } from '@lihim/shared/core';

import { LABEL_USERNAME } from '../constants';
import { lengths, regex } from '../misc';

export const UsernameSchema = zodString(
  LABEL_USERNAME,
  lengths.principal.min,
  lengths.principal.max,
).regex(regex.username, errPhrase(LABEL_USERNAME, ERR_SUFFIX_INVALID));
