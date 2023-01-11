import { useQuery } from '@tanstack/react-query';

import type { Session } from '@lihim/auth/core';
import { API_URL_SESSION } from '@lihim/auth/core';
import { SessionSchema } from '@lihim/auth/core';
import type { GenericResponse } from '@lihim/shared/core';

import { apiFetch } from '../fetch/api-fetch/api-fetch';

const fetchSession = apiFetch<Session>(API_URL_SESSION, {
  method: 'GET',
  responseSchema: SessionSchema,
});

export const useSession = () =>
  useQuery<Session, GenericResponse>(['session'], async () => fetchSession());
