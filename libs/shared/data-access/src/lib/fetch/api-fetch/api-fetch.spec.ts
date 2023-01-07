import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { z } from 'zod';

import {
  GenericResponse,
  GenericResponseSchema,
  httpErrors,
  METHOD_GET,
  METHOD_POST,
  Undefined,
  UndefinedSchema,
} from '@lihim/shared/core';

import { apiFetch } from './api-fetch';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
afterEach(() => mswServer.resetHandlers());

describe('api-fetch', () => {
  // Mock vars
  const mockUrl = 'mock-url';
  const mockMessage = 'mock-message';

  test('offline', async () => {
    // Mock navigator offline
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);

    // Mock network error
    mswServer.use(rest.get(mockUrl, (_req, res, _ctx) => res.networkError('')));

    // Create fetch function
    const fetchSomething = apiFetch<GenericResponse>(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
    });

    // Assert
    await expect(fetchSomething()).rejects.toThrow(httpErrors.offline);
  });

  test('non-json response', async () => {
    // Mock non-json response
    mswServer.use(
      rest.get(mockUrl, (_req, res, ctx) =>
        res(ctx.status(200), ctx.body('OK')),
      ),
    );

    // Create fetch function
    const fetchSomething = apiFetch<GenericResponse>(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
    });

    // Assert
    await expect(fetchSomething()).rejects.toThrow(httpErrors.internal);
  });

  test('get w/o params', async () => {
    // Mock response message
    const mockResponse: GenericResponse = {
      message: mockMessage,
    };
    mswServer.use(
      rest.get(mockUrl, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockResponse)),
      ),
    );

    // Create fetch function
    const fetchSomething = apiFetch<GenericResponse>(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
    });

    // Assert
    await expect(fetchSomething()).resolves.toStrictEqual(mockResponse);
  });

  test('get w/ params', async () => {
    // Mock param payload
    const mockId = 'test-id';
    const mockPayloadSchema = z.object({
      id: z.string(),
    });
    type TPayloadSchema = z.infer<typeof mockPayloadSchema>;
    const mockPayloadParam: TPayloadSchema = { id: mockId };

    // Mock response message (we return back id sent through payload param)
    mswServer.use(
      rest.get(mockUrl, (req, res, ctx) => {
        const id = req.url.searchParams.get('id');

        return res(ctx.status(200), ctx.json({ message: id }));
      }),
    );

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      GenericResponse,
      TPayloadSchema
    >(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
      payloadSchema: mockPayloadSchema,
    });

    // Assert
    await expect(fetchSomething(mockPayloadParam)).resolves.toStrictEqual({
      message: mockId,
    });
  });

  test('post w/o payload', async () => {
    // Mock response message
    const mockResponse: GenericResponse = {
      message: mockMessage,
    };
    mswServer.use(
      rest.post(mockUrl, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockResponse)),
      ),
    );

    // Create fetch function
    const fetchSomething = apiFetch<GenericResponse>(mockUrl, {
      method: METHOD_POST,
      responseSchema: GenericResponseSchema,
    });

    // Assert
    await expect(fetchSomething()).resolves.toStrictEqual(mockResponse);
  });

  test('post w/ payload', async () => {
    // Mock param payload
    const mockId = 'test-id';
    const mockPayloadSchema = z.object({
      id: z.string(),
    });
    type TPayloadSchema = z.infer<typeof mockPayloadSchema>;
    const mockPayloadParam: TPayloadSchema = { id: mockId };

    // Mock response message (we echo payload id as response message)
    mswServer.use(
      rest.post(mockUrl, async (req, res, ctx) => {
        const { id } = await req.json();

        return res(ctx.status(200), ctx.json({ message: id }));
      }),
    );

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      GenericResponse,
      TPayloadSchema
    >(mockUrl, {
      method: METHOD_POST,
      responseSchema: GenericResponseSchema,
      errorSchema: GenericResponseSchema,
      payloadSchema: mockPayloadSchema,
    });

    // Assert
    await expect(fetchSomething(mockPayloadParam)).resolves.toStrictEqual({
      message: mockId,
    });
  });

  test('invalid request payload', async () => {
    // Mock param payload
    const mockId = 'test-id';
    const mockPayloadSchema = z.object({
      id: z.string(),
    });
    type TPayloadSchema = z.infer<typeof mockPayloadSchema>;
    const mockPayloadParam = { idx: mockId } as unknown as TPayloadSchema;

    // Mock response message (we return back id sent through payload param)
    mswServer.use(
      rest.get(mockUrl, (req, res, ctx) => {
        const id = req.url.searchParams.get('id');

        return res(ctx.status(200), ctx.json({ message: id }));
      }),
    );

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      GenericResponse,
      TPayloadSchema
    >(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
      payloadSchema: mockPayloadSchema,
    });

    // Assert
    try {
      await fetchSomething(mockPayloadParam);
    } catch (error) {
      expect(error).toStrictEqual({ message: httpErrors.invalidRequest });
    }
  });

  test('invalid response schema', async () => {
    // Mock response message different to expected schema
    const mockResponse = {
      error: 'some-error',
    };
    mswServer.use(
      rest.get(mockUrl, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(mockResponse)),
      ),
    );

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      GenericResponse,
      Undefined
    >(mockUrl, {
      method: METHOD_GET,
      responseSchema: GenericResponseSchema,
      errorSchema: GenericResponseSchema,
      payloadSchema: UndefinedSchema,
    });

    // Assert
    try {
      await fetchSomething();
    } catch (error) {
      expect(error).toStrictEqual({ message: httpErrors.invalidResponse });
    }
  });

  test('using error-schema', async () => {
    // Mock param payload
    const mockId = 'test-id';
    const mockPayloadSchema = z.object({
      id: z.string(),
    });
    type TPayloadSchema = z.infer<typeof mockPayloadSchema>;
    const mockPayloadParam: TPayloadSchema = { id: mockId };

    // Expected error schema
    const errorMessage = 'custom error message';
    const customErrorSchema = z.object({
      id: z.string(),
      errorMessage: z.string(),
    });
    type TErrorSchema = z.infer<typeof customErrorSchema>;

    // Mock response message (we echo payload id as response message)
    mswServer.use(
      rest.post(mockUrl, async (req, res, ctx) => {
        const { id } = await req.json();

        // We return error implementing error schema
        return res(ctx.status(400), ctx.json({ id, errorMessage }));
      }),
    );

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      TErrorSchema,
      TPayloadSchema
    >(mockUrl, {
      method: METHOD_POST,
      responseSchema: GenericResponseSchema,
      errorSchema: customErrorSchema,
      payloadSchema: mockPayloadSchema,
    });

    // Assert
    try {
      await fetchSomething(mockPayloadParam);
    } catch (error) {
      expect(error).toStrictEqual({ id: mockId, errorMessage });
    }
  });

  test('undefined error-schema', async () => {
    // Mock response message
    const errorMessage = 'error-message';
    mswServer.use(
      rest.post(mockUrl, async (req, res, ctx) =>
        // We return error implementing error schema
        res(ctx.status(400), ctx.json({ message: errorMessage })),
      ),
    );

    // Create fetch function
    const fetchSomething = apiFetch<GenericResponse>(mockUrl, {
      method: METHOD_POST,
      responseSchema: GenericResponseSchema,
    });

    // Assert
    try {
      await fetchSomething();
    } catch (error) {
      expect(error).toStrictEqual({ message: errorMessage });
    }
  });

  test('invalid error-schema', async () => {
    // Mock param payload
    const mockId = 'test-id';
    const mockPayloadSchema = z.object({
      id: z.string(),
    });
    type TPayloadSchema = z.infer<typeof mockPayloadSchema>;
    const mockPayloadParam: TPayloadSchema = { id: mockId };

    // Mock response message (we echo payload id as response message)
    mswServer.use(
      rest.post(mockUrl, async (req, res, ctx) => {
        const { id } = await req.json();

        // We return error NOT implementing error schema
        return res(ctx.status(400), ctx.json({ message: id }));
      }),
    );

    // Expected error schema
    const customErrorSchema = z.object({
      errorMessage: z.string(),
    });
    type TErrorSchema = z.infer<typeof customErrorSchema>;

    // Create fetch function
    const fetchSomething = apiFetch<
      GenericResponse,
      TErrorSchema,
      TPayloadSchema
    >(mockUrl, {
      method: METHOD_POST,
      responseSchema: GenericResponseSchema,
      errorSchema: customErrorSchema,
      payloadSchema: mockPayloadSchema,
    });

    // Assert
    await expect(fetchSomething(mockPayloadParam)).rejects.toThrow(
      httpErrors.internal,
    );
  });
});
