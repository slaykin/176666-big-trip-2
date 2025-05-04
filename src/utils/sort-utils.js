import dayjs from 'dayjs';

const SortType = {
  DAY:'day',
  EVENT:'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const sortSettings = [
  {
    name: SortType.DAY,
    isAvailable: true,
    isDefault: true
  },
  {
    name: SortType.EVENT,
    isAvailable: false,
    isDefault: false
  },
  {
    name: SortType.TIME,
    isAvailable: true,
    isDefault: false
  },
  {
    name: SortType.PRICE,
    isAvailable: true,
    isDefault: false
  },
  {
    name: SortType.OFFERS,
    isAvailable: false,
    isDefault: false
  }
];

function getEventDuration(event) {
  return dayjs(event.dateFrom).diff(event.dateTo);
}

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
  static get sortSettings() {
    return sortSettings;
  }

  static get defaultSortType() {
    return sortSettings.find((sortType) => sortType.isDefault === true).name;
  }

  static sortEvents(sortType, events) {
    switch (sortType) {
      case SortType.TIME:
        events.sort(sortEventTime);
        break;
      case SortType.PRICE:
        events.sort(sortEventPrice);
        break;
      default:
        events.sort(sortEventDay);
    }
  }
}
