import { useQuery } from '@tanstack/react-query';

import type { Session } from '@lihim/auth/core';
import { authUrls, SessionSchema } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';
import { apiFetch } from '@lihim/shared/data-access';

const fetchSession = apiFetch<Session>(authUrls.session, {
  method: 'GET',
  responseSchema: SessionSchema,
});

export const useSession = () =>
  useQuery<Session, GenericResponse>(['session'], async () => fetchSession());
