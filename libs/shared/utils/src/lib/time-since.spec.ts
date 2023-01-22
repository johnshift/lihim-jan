import { timeSince } from './time-since';

describe('timeSince', () => {
  describe.each([[true], [false]])('toISOString = %s', (isIso) => {
    test.each([
      ['just now', 1000 * 59],
      ['just now', 1000 * 59, false],
      ['1min ago', 1000 * 60],
      ['1 minute ago', 1000 * 60, false],
      ['2mins ago', 1000 * 60 * 2],
      ['2 minutes ago', 1000 * 60 * 2, false],
      ['1h ago', 1000 * 60 * 60],
      ['1 hour ago', 1000 * 60 * 60, false],
      ['2h ago', 1000 * 60 * 60 * 2],
      ['2 hours ago', 1000 * 60 * 60 * 2, false],
      ['1d ago', 1000 * 60 * 60 * 24],
      ['yesterday', 1000 * 60 * 60 * 24, false],
      ['2d ago', 1000 * 60 * 60 * 24 * 2],
      ['2 days ago', 1000 * 60 * 60 * 24 * 2, false],
      ['1w ago', 1000 * 60 * 60 * 24 * 7],
      ['1 week ago', 1000 * 60 * 60 * 24 * 7, false],
      ['2w ago', 1000 * 60 * 60 * 24 * 7 * 2],
      ['2 weeks ago', 1000 * 60 * 60 * 24 * 7 * 2, false],
      ['1m ago', 1000 * 60 * 60 * 24 * 30],
      ['1 month ago', 1000 * 60 * 60 * 24 * 30, false],
      ['2m ago', 1000 * 60 * 60 * 24 * 30 * 2],
      ['2 months ago', 1000 * 60 * 60 * 24 * 30 * 2, false],
    ])('%s', (expected, secondsBefore, isShorthand = true) => {
      // Now reference
      const now = new Date();

      // <1 minute ago
      const ts = new Date(now.getTime() - secondsBefore);

      // Exec
      const result = timeSince(isIso ? ts.toISOString() : ts, isShorthand);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('years', () => {
    test('1y ago', () => {
      // Now reference
      const now = new Date();

      // 1 year ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12);

      // Exec
      const result = timeSince(ts);

      // Assert
      expect(result).toBe(
        `${ts.toLocaleDateString('default', {
          month: 'short',
          day: '2-digit',
        })}`,
      );
    });

    test('1y ago (string)', () => {
      // Now reference
      const now = new Date();

      // 1 year ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12);

      // Exec
      const result = timeSince(ts.toISOString());

      // Assert
      expect(result).toBe(
        `${ts.toLocaleDateString('default', {
          month: 'short',
          day: '2-digit',
        })}`,
      );
    });

    test('1y ago longhand', () => {
      // Now reference
      const now = new Date();

      // 1 year ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12);

      // Exec
      const result = timeSince(ts, false);

      // Assert
      expect(result).toBe(
        `${ts.toLocaleDateString('default', {
          month: 'short',
          day: '2-digit',
        })}`,
      );
    });

    test('1y ago longhand (string)', () => {
      // Now reference
      const now = new Date();

      // 1 year ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12);

      // Exec
      const result = timeSince(ts.toISOString(), false);

      // Assert
      expect(result).toBe(
        `${ts.toLocaleDateString('default', {
          month: 'short',
          day: '2-digit',
        })}`,
      );
    });

    test('2y ago', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12 * 2);

      // Exec
      const result = timeSince(ts);

      // Assert
      expect(result).toBe('2y ago');
    });

    test('2y ago (string)', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12 * 2);

      // Exec
      const result = timeSince(ts.toISOString());

      // Assert
      expect(result).toBe('2y ago');
    });

    test('2y ago longhand', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12 * 2);

      // Exec
      const result = timeSince(ts, false);

      // Assert
      expect(result).toBe('2 years ago');
    });

    test('2y ago longhand (string)', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 12 * 2);

      // Exec
      const result = timeSince(ts.toISOString(), false);

      // Assert
      expect(result).toBe('2 years ago');
    });
  });
});
