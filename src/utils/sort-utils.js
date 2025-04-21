import dayjs from 'dayjs';
import {getEventDuration} from './date-utils';

const sortTypes = [
  {
    name: 'day',
    isAvailable: true,
    isDefault: true
  },
  {
    name: 'event',
    isAvailable: false,
    isDefault: false
  },
  {
    name: 'time',
    isAvailable: true,
    isDefault: false
  },
  {
    name: 'price',
    isAvailable: true,
    isDefault: false
  },
  {
    name: 'offers',
    isAvailable: false,
    isDefault: false
  }
];

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortEventDay(eventA, eventB) {
  const weight = getWeightForNullDate(eventA.dateFrom, eventB.dateFrom);

  return weight ?? dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

function sortEventTime(eventA, eventB) {
  const weight = getWeightForNullDate(eventA.dateFrom, eventB.dateFrom);

  return weight ?? getEventDuration(eventA) - getEventDuration(eventB);
}

function sortEventPrice(eventA, eventB) {
  return eventB.basePrice - eventA.basePrice;
}

export default class EventSort {
  static get sortTypes() {
    return sortTypes;
  }

  static get defaultSortType() {
    return sortTypes.find((sortType) => sortType.isDefault === true).name;
  }

  static sortEvents(sortType, events) {
    switch (sortType) {
      case 'time':
        events.sort(sortEventTime);
        break;
      case 'price':
        events.sort(sortEventPrice);
        break;
      default:
        events.sort(sortEventDay);
    }
  }
}
