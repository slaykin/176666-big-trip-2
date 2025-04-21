import dayjs from 'dayjs';
import {FilterType} from '../const';

const today = dayjs();

const filters = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom) > today),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom) <= today && dayjs(event.dateTo) >= today),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo) < today)
};

function generateFilters(events) {
  return Object.entries(filters).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(events).length,
    }),
  );
}

export {generateFilters};
