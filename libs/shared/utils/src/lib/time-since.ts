export const timeSince = (
  timestamp: Date | string,
  shorthand = true,
): string => {
  const now = new Date();

  const ts = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const seconds = Math.floor((now.getTime() - ts.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  let interval = Math.floor(seconds / 60);

  const prettyDate = (str: 'min' | 'hour' | 'day' | 'week') => {
    const num = Math.floor(interval);

    if (str === 'min') {
      return `${num}${shorthand ? '' : ' '}min${shorthand ? '' : 'ute'}${
        num > 1 ? 's' : ''
      } ago`;
    }

    return `${num}${shorthand ? '' : ' '}${shorthand ? str.charAt(0) : str}${
      !shorthand && num !== 1 ? 's' : ''
    } ago`;
  };

  if (interval < 60) {
    return prettyDate('min');
  }

  interval = Math.floor(seconds / 3600);
  if (interval < 24) {
    return prettyDate('hour');
  }

  interval = Math.floor(seconds / 86_400);
  if (interval < 7) {
    if (interval === 1 && !shorthand) {
      return 'yesterday';
    }

    return prettyDate('day');
  }

  interval = Math.floor(seconds / 604_800);
  if (interval < 4) {
    return prettyDate('week');
  }

  interval = Math.floor(seconds / 2_592_000);
  if (interval < 12) {
    return `${interval}${
      shorthand ? 'm' : ` month${interval > 1 ? 's' : ''}`
    } ago`;
  }

  interval = Math.floor(seconds / 31_536_000);
  const dateOptions = {
    month: 'short',
    day: '2-digit',
    year: interval === 0 ? undefined : 'numeric',
  } as Intl.DateTimeFormatOptions;

  // Show month + date if on the same year
  if (interval < 1) {
    return ts.toLocaleDateString('en-US', dateOptions);
  }

  return `${interval + 1}${shorthand ? '' : ' '}y${
    shorthand ? '' : 'ears'
  } ago`;
};
