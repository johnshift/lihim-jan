import * as mantineCore from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

import { render, renderHook, screen } from '@lihim/shared/testutils/ui';

import { PageLayout } from './page-layout';

jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
}));

describe('PageLayout', () => {
  // Actual hook
  const { result } = renderHook(() => useMantineTheme());

  test('render dark ok', () => {
    // Test vars
    const testId = 'child-testid';

    // Spy on useMantineTheme return 'dark' theme
    jest.spyOn(mantineCore, 'useMantineTheme').mockReturnValueOnce({
      ...result.current,
      colorScheme: 'dark',
    });

    // Render component
    render(
      <PageLayout>
        <div data-testid={testId} />
      </PageLayout>,
    );

    expect(screen.getByTestId(testId)).toBeVisible();
  });

  test('render light ok', () => {
    // Test vars
    const testId = 'child-testid';

    // Spy on useMantineTheme return 'light' theme
    jest.spyOn(mantineCore, 'useMantineTheme').mockReturnValueOnce({
      ...result.current,
      colorScheme: 'light',
    });

    // Render component
    render(
      <PageLayout>
        <div data-testid={testId} />
      </PageLayout>,
    );

    expect(screen.getByTestId(testId)).toBeVisible();
  });
});
