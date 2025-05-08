import dayjs from 'dayjs';

const MILLISECONDS_IN_HOUR = 3600000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const REQUIRED_STRING_LENGTH = 2;
const EVENT_HOUR_OFFSET = 1;

const DateFormat = {
  DAY: 'MMM DD',
  TIME: 'HH:mm',
  DATE: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i',
  TRIP_DATE: 'DD MMM',
};

function getFlatpickrConfig() {
  return {
    enableTime: true,
    'time_24hr': true,
    locale: {firstDayOfWeek: 1},
    dateFormat: DateFormat.FLATPICKR
  };
}

function isSameDate(firstDate, secondDate) {
  return (firstDate === null && secondDate === null) || dayjs(firstDate).isSame(dayjs(secondDate));
}

function getFormattedDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getFormattedDuration(firstDate, secondDate) {
  const days = dayjs(secondDate).diff(firstDate, 'day');
  const hours = dayjs(secondDate).diff(firstDate, 'hour') - (days * HOURS_IN_DAY);
  const minutes = dayjs(secondDate).diff(firstDate, 'minute') - ((hours * MINUTES_IN_HOUR) + ((days * HOURS_IN_DAY) * MINUTES_IN_HOUR));

  const daysText = days > 0 ? `${String(days).padStart(REQUIRED_STRING_LENGTH, '0')}D ` : '';
  const hoursText = (days > 0 || hours > 0) ? `${String(hours).padStart(REQUIRED_STRING_LENGTH, '0')}H ` : '';
  const minutesText = `${String(minutes).padStart(REQUIRED_STRING_LENGTH, '0')}M`;
  return `${daysText}${hoursText}${minutesText}`;
}

export {
  MILLISECONDS_IN_HOUR,
  EVENT_HOUR_OFFSET,
  DateFormat,
  getFlatpickrConfig,
  isSameDate,
  getFormattedDate,
  getFormattedDuration,
};
