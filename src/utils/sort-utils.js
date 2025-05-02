import dayjs from 'dayjs';
import {getEventDuration} from './date-utils';

const SortTypes = {
  DAY:'day',
  EVENT:'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const sortSettings = [
  {
    name: SortTypes.DAY,
    isAvailable: true,
    isDefault: true
  },
  {
    name: SortTypes.EVENT,
    isAvailable: false,
    isDefault: false
  },
  {
    name: SortTypes.TIME,
    isAvailable: true,
    isDefault: false
  },
  {
    name: SortTypes.PRICE,
    isAvailable: true,
    isDefault: false
  },
  {
    name: SortTypes.OFFERS,
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
    return sortSettings;
  }

  static get defaultSortType() {
    return sortSettings.find((sortType) => sortType.isDefault === true).name;
  }

  static sortEvents(sortType, events) {
    switch (sortType) {
      case SortTypes.TIME:
        events.sort(sortEventTime);
        break;
      case SortTypes.PRICE:
        events.sort(sortEventPrice);
        break;
      default:
        events.sort(sortEventDay);
    }
  }
}
