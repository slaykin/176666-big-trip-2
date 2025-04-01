import { FilterType } from './const.js';
import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;
function getRandomInteger(max) {
  return Math.floor(Math.random() * max);
}
function getRandomArrayElement(array) {
  return array[getRandomInteger(array.length)];
}
function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}
function getDay(date) {
  return dayjs(date).format('MMM DD');
}
function getTime(date) {
  return dayjs(date).format('HH:mm');
}
function getEventDuration(earlierDate, laterDate) {
  const totalDifferenceInMinutes = dayjs(laterDate).diff(dayjs(earlierDate), 'minute');
  const differenceInMinutes = `${(totalDifferenceInMinutes % MINUTES_IN_HOUR).toString().padStart(2, '0')}M`;
  const differenceInHours = `${((Math.floor(totalDifferenceInMinutes / MINUTES_IN_HOUR)) % HOURS_IN_DAY).toString().padStart(2, '0')}H`;
  const differenceInDays = `${(Math.floor(totalDifferenceInMinutes / MINUTES_IN_DAY)).toString().padStart(2, '0')}D`;
  if (totalDifferenceInMinutes < MINUTES_IN_HOUR) {
    return differenceInMinutes;
  } else if (totalDifferenceInMinutes < MINUTES_IN_DAY) {
    return `${differenceInHours} ${differenceInMinutes}`;
  } else {
    return `${differenceInDays} ${differenceInHours} ${differenceInMinutes}`;
  }
}
function transformIntoKebabCase(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}
function capitalizeString(string) {
  return string[0].toUpperCase() + string.slice(1);
}
function createIdGenerator() {
  let id = 1;
  return function() {
    return id++;
  };
}

const idGenerator = createIdGenerator();

function compareDates({dateFrom, dateTo}) {
  if (new Date(dateFrom) > new Date()) {
    return 'future';
  } else if (new Date(dateTo) < new Date()) {
    return 'past';
  } else {
    return 'present';
  }
}

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => compareDates(event) === 'future'),
  [FilterType.PRESENT]: (events) => events.filter((event) => compareDates(event) === 'present'),
  [FilterType.PAST]: (events) => events.filter((event) => compareDates(event) === 'past'),
};

export {
  getRandomInteger,
  getRandomArrayElement,
  getFullDate,
  getDay,
  getTime,
  getEventDuration,
  transformIntoKebabCase,
  capitalizeString,
  idGenerator,
  filter,
};
