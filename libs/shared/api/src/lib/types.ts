import { NextApiRequest, NextApiResponse } from 'next';

import { createRequest, createResponse } from 'node-mocks-http';

export type MockApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type MockApiResponse = NextApiResponse &
  ReturnType<typeof createResponse>;
