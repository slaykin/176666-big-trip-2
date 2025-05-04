import dayjs from 'dayjs';
const HOURS_IN_DAY = 24;
const MANUTES_IN_HOUR = 60;
const REQUIRED_STRING_LENGTH = 2;
const EVENT_HOUR_OFFSET = 1;

const DateFormat = {
  DAY: 'MMM DD',
  TIME: 'HH:mm',
  DATE: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i'
};

function getFlatpickrConfig() {
  return {
    enableTime: true,
    'time_24hr': true,
    locale: {firstDayOfWeek: 1},
    dateFormat: DateFormat.FLATPICKR
  };
}

function getFormattedDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getFormattedDuration(dateA, dateB) {
  const days = dayjs(dateB).diff(dateA, 'day');
  const hours = dayjs(dateB).diff(dateA, 'hour') - (days * HOURS_IN_DAY);
  const minutes = dayjs(dateB).diff(dateA, 'minute') - ((hours * MANUTES_IN_HOUR) + ((days * HOURS_IN_DAY) * MANUTES_IN_HOUR));

  const daysText = days > 0 ? `${String(days).padStart(REQUIRED_STRING_LENGTH, '0')}D ` : '';
  const hoursText = (days > 0 || hours > 0) ? `${String(hours).padStart(REQUIRED_STRING_LENGTH, '0')}H ` : '';
  const minutesText = `${String(minutes).padStart(REQUIRED_STRING_LENGTH, '0')}M`;
  return `${daysText}${hoursText}${minutesText}`;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dayjs(dateB));
}

export {
  EVENT_HOUR_OFFSET,
  DateFormat,
  getFlatpickrConfig,
  getFormattedDate,
  getFormattedDuration,
  isDatesEqual,
};
