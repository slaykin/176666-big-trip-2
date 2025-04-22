const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DateFormat = {
  DAY: 'MMM DD',
  TIME: 'HH:mm',
  DATE: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const flatpickrConfig = {
  enableTime: true,
  'time_24hr': true,
  locale: {firstDayOfWeek: 1},
  dateFormat: DateFormat.FLATPICKR
};

export {
  EVENT_TYPES,
  DateFormat,
  FilterType,
  flatpickrConfig
};
