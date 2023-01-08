import { render, screen, waitFor } from '@testing-library/react';

import { setupServer } from 'msw/node';

import { fakeSession, mockSessionResponse } from '@lihim/auth/testutils';
import { TestWrapper } from '@lihim/shared/testutils/data-access';

import { useRootContext } from '../hooks/use-root-context';

import { RootProvider } from './root-context';

// Setup msw server
const mswServer = setupServer();
beforeAll(() => mswServer.listen());
afterAll(() => mswServer.close());
beforeEach(() => mswServer.resetHandlers());
afterEach(() => mswServer.resetHandlers());

describe('rootContext', () => {
  test('default values', async () => {
    // Mock session response
    const body = fakeSession();
    mswServer.use(mockSessionResponse(200, body));

    // Test values
    const dataTestId = 'data-testid';
    const loadingTestId = 'loading-testid';

    // TestComponent
    const TestComponent = () => {
      const { session, isLoading } = useRootContext();

      return (
        <>
          <p data-testid={dataTestId}>{JSON.stringify(session)}</p>
          <p data-testid={loadingTestId}>{isLoading.toString()}</p>
        </>
      );
    };

    // Render component
    render(
      <TestWrapper>
        <RootProvider>
          <TestComponent />
        </RootProvider>
      </TestWrapper>,
    );

    // Wait loading
    await waitFor(() => {
      expect(screen.getByTestId(loadingTestId)).toHaveTextContent('false');
    });

    // Assert data
    expect(screen.getByTestId(dataTestId)).toHaveTextContent(
      JSON.stringify(body),
    );
  });
});
