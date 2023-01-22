const getTimeStamp = (timestamp: Date | string) =>
  typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

/** Returns spacebar if not shorthand */
const getNumSpace = (shorthand: boolean) => `${shorthand ? '' : ' '}`;

/** Returns 's' for non-shorthand plurals */
const getPlural = (num: number, shorthand: boolean) =>
  !shorthand && num > 1 ? 's' : '';

/** Returns unit shorthand + plural form */
const getUnit = (num: number, shorthand: boolean, unit: string) =>
  `${shorthand ? unit.charAt(0) : unit}${getPlural(num, shorthand)}`;

/** Returns minute unit "min" (redeclared since "min" has same charAt(0) with months) */
const getMinuteUnit = (num: number, shorthand: boolean) =>
  `min${shorthand ? '' : 'ute'}${num > 1 ? 's' : ''}`;

type PrettyDateUnits = 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';

export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;
export const WEEK_MS = DAY_MS * 7;
export const MONTH_MS = DAY_MS * 30;
export const YEAR_MS = MONTH_MS * 12;

const prettyDate = (
  interval: number,
  str: PrettyDateUnits,
  shorthand: boolean,
) => {
  const num = Math.floor(interval);
  const isMinute = str === 'min';
  const getUnitFn = isMinute ? getMinuteUnit : getUnit;

  const numSpace = getNumSpace(shorthand);
  const unit = getUnitFn(num, shorthand, str);

  return `${num}${numSpace}${unit} ago`;
};

const getUnitFn =
  (baseline: number, intervalFactor: number, unit: PrettyDateUnits) =>
  (_: Date, ms: number, shorthand: boolean) =>
    ms < baseline
      ? prettyDate(Math.floor(ms / intervalFactor), unit, shorthand)
      : '';

const getMinuteStr = getUnitFn(HOUR_MS, MINUTE_MS, 'min');
const getHourStr = getUnitFn(DAY_MS, HOUR_MS, 'hour');
const getWeekStr = getUnitFn(MONTH_MS - WEEK_MS, WEEK_MS, 'week');
const getMonthStr = getUnitFn(YEAR_MS, MONTH_MS, 'month');

const getJustNowStr = (_: Date, ms: number, _shorthand: boolean) =>
  ms < MINUTE_MS ? 'just now' : '';

const getDayStr = (_: Date, ms: number, shorthand: boolean) => {
  if (ms < WEEK_MS) {
    if (ms < 2 * DAY_MS && !shorthand) {
      return 'yesterday';
    }

    return prettyDate(Math.floor(ms / DAY_MS), 'day', shorthand);
  }

  return '';
};

const getYearStr = (ts: Date, ms: number, shorthand: boolean) => {
  const interval = Math.floor(ms / YEAR_MS);
  console.log('INTERVAL =', interval);
  const dateOptions = {
    month: 'short',
    day: '2-digit',
    year: interval < 2 ? undefined : 'numeric',
  } as Intl.DateTimeFormatOptions;

  if (interval < 2) {
    return ts.toLocaleDateString('en-US', dateOptions);
  }

  return prettyDate(interval, 'year', shorthand);
};

export const timeSince = (
  timestamp: Date | string,
  shorthand = true,
): string => {
  const now = new Date();

  const ts = getTimeStamp(timestamp);
  const ms = now.getTime() - ts.getTime();

  const fnArr = [
    getJustNowStr,
    getMinuteStr,
    getHourStr,
    getDayStr,
    getWeekStr,
    getMonthStr,
    getYearStr,
  ];
  return fnArr
    .map((fn) => fn(ts, ms, shorthand))
    .find((s) => s !== '') as string;
};
