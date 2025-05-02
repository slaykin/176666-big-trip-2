import dayjs from 'dayjs';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const REQUIRED_STRING_LENGTH = 2;


function getFormattedDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}


function getDateDifference(dateA, dateB) {
  const days = dayjs(dateA).diff(dateB, 'day');
  const hours = dayjs(dateA).diff(dateB, 'hour') - (days * HOURS_IN_DAY);
  const minutes = dayjs(dateA).diff(dateB, 'minute') - ((hours * MINUTES_IN_HOUR) + ((days * HOURS_IN_DAY) * MINUTES_IN_HOUR));

  const daysText = days > 0 ? `${String(days).padStart(REQUIRED_STRING_LENGTH, '0')}D ` : '';
  const hoursText = (days > 0 || hours > 0) ? `${String(hours).padStart(REQUIRED_STRING_LENGTH, '0')}H ` : '';
  const minutesText = `${String(minutes).padStart(REQUIRED_STRING_LENGTH, '0')}M`;

  return `${daysText}${hoursText}${minutesText}`;
}

function getEventDuration(event) {
  const eventDuration = dayjs(event.dateFrom).diff(event.dateTo);
  return eventDuration;
}

export {
  getFormattedDate,
  getDateDifference,
  getEventDuration
};
