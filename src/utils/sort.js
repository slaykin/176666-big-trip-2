import {SortType} from '../const.js';
import dayjs from 'dayjs';

const DEFAULT_SORT_TYPE = SortType.DAY;

const sortSettings = [
  {
    name: SortType.DAY,
    isAvailable: true,
  },
  {
    name: SortType.EVENT,
    isAvailable: false,
  },
  {
    name: SortType.TIME,
    isAvailable: true,
  },
  {
    name: SortType.PRICE,
    isAvailable: true,
  },
  {
    name: SortType.OFFERS,
    isAvailable: false,
  }
];

function getEventDuration(event) {
  return dayjs(event.dateFrom).diff(event.dateTo);
}

function getWeightForNullDate(firstDate, secondDate) {
  if (firstDate === null && secondDate === null) {
    return 0;
  }

  if (firstDate === null) {
    return 1;
  }

  if (secondDate === null) {
    return -1;
  }

  return null;
}

function sortEventDay(firstEvent, secondEvent) {
  const weight = getWeightForNullDate(firstEvent.dateFrom, secondEvent.dateFrom);

  return weight ?? dayjs(firstEvent.dateFrom).diff(dayjs(secondEvent.dateFrom));
}

function sortEventTime(firstEvent, secondEvent) {
  const weight = getWeightForNullDate(firstEvent.dateFrom, secondEvent.dateFrom);

  return weight ?? getEventDuration(firstEvent) - getEventDuration(secondEvent);
}

function sortEventPrice(firstEvent, secondEvent) {
  return secondEvent.basePrice - firstEvent.basePrice;
}

export default class EventSort {
  static get sortSettings() {
    return sortSettings;
  }

  static get defaultSortType() {
    return DEFAULT_SORT_TYPE;
  }

  static sortEvents(events, sortType = this.defaultSortType) {
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
