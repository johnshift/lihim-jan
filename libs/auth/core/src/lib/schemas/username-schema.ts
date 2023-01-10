import { ERR_SUFFIX_INVALID, errPhrase, zodString } from '@lihim/shared/core';

import { lengths, regex, subjects } from '../misc';

export const UsernameSchema = zodString(
  subjects.username,
  lengths.principal.min,
  lengths.principal.max,
).regex(regex.username, errPhrase(subjects.username, ERR_SUFFIX_INVALID));
