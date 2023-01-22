import {
  DAY_MS,
  HOUR_MS,
  MINUTE_MS,
  MONTH_MS,
  SECOND_MS,
  timeSince,
  WEEK_MS,
  YEAR_MS,
} from './time-since';

describe('timeSince', () => {
  describe.each([[true], [false]])('toISOString = %s', (isIso) => {
    test.each([
      ['just now', SECOND_MS * 59],
      ['just now', SECOND_MS * 59, false],
      ['1min ago', MINUTE_MS],
      ['1 minute ago', MINUTE_MS, false],
      ['2mins ago', MINUTE_MS * 2],
      ['2 minutes ago', MINUTE_MS * 2, false],
      ['59mins ago', MINUTE_MS * 59],
      ['59 minutes ago', MINUTE_MS * 59, false],
      ['1h ago', HOUR_MS],
      ['1 hour ago', HOUR_MS, false],
      ['2h ago', HOUR_MS * 2],
      ['2 hours ago', HOUR_MS * 2, false],
      ['23h ago', HOUR_MS * 23],
      ['23 hours ago', HOUR_MS * 23, false],
      ['1d ago', DAY_MS],
      ['yesterday', DAY_MS, false],
      ['2d ago', DAY_MS * 2],
      ['2 days ago', DAY_MS * 2, false],
      ['6d ago', DAY_MS * 6],
      ['6 days ago', DAY_MS * 6, false],
      ['1w ago', WEEK_MS],
      ['1 week ago', WEEK_MS, false],
      ['2w ago', WEEK_MS * 2],
      ['2 weeks ago', WEEK_MS * 2, false],
      ['3w ago', WEEK_MS * 3],
      ['3 weeks ago', WEEK_MS * 3, false],
      ['1m ago', MONTH_MS],
      ['1 month ago', MONTH_MS, false],
      ['2m ago', MONTH_MS * 2],
      ['2 months ago', MONTH_MS * 2, false],
      ['11m ago', MONTH_MS * 11],
      ['11 months ago', MONTH_MS * 11, false],
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
      const ts = new Date(now.getTime() - YEAR_MS);

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
      const ts = new Date(now.getTime() - YEAR_MS);

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
      const ts = new Date(now.getTime() - YEAR_MS);

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
      const ts = new Date(now.getTime() - YEAR_MS);

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
      const ts = new Date(now.getTime() - YEAR_MS * 2);

      // Exec
      const result = timeSince(ts);

      // Assert
      expect(result).toBe('2y ago');
    });

    test('2y ago (string)', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - YEAR_MS * 2);

      // Exec
      const result = timeSince(ts.toISOString());

      // Assert
      expect(result).toBe('2y ago');
    });

    test('2y ago longhand', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - YEAR_MS * 2);

      // Exec
      const result = timeSince(ts, false);

      // Assert
      expect(result).toBe('2 years ago');
    });

    test('2y ago longhand (string)', () => {
      // Now reference
      const now = new Date();

      // 2 years ago
      const ts = new Date(now.getTime() - YEAR_MS * 2);

      // Exec
      const result = timeSince(ts.toISOString(), false);

      // Assert
      expect(result).toBe('2 years ago');
    });
  });
});
