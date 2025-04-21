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
  DATE: 'DD/MM/YY HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export {
  EVENT_TYPES,
  DateFormat,
  FilterType,
};
