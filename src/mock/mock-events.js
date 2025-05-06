const mockSourcedEvents = [
  {
    id: 'cd8ee95b-95e9-42ab-81d2-232d1070b84a',
    basePrice: 1000,
    dateFrom: '2024-12-30T14:34:11.060Z',
    dateTo: '2024-12-31T05:45:11.060Z',
    destination: '53b6b366-1de8-447a-93ae-e71dc7d59aa7',
    isFavorite: true,
    offers: [],
    type: 'restaurant'
  },
  {
    id: '81b18db0-4178-4d23-b135-0c4805ddef7e',
    basePrice: 700,
    dateFrom: '2025-01-01T20:52:11.060Z',
    dateTo: '2025-01-30T09:09:11.060Z',
    destination: '7d2cc347-4428-45cb-b406-ef07ed787acc',
    isFavorite: false,
    offers: [],
    type: 'restaurant'
  },
  {
    id: '7a10e74f-b5e4-4207-ad16-94bda36a2dc3',
    basePrice: 100,
    dateFrom: '2025-02-01T06:19:11.060Z',
    dateTo: '2025-02-28T14:36:11.060Z',
    destination: '53b6b366-1de8-447a-93ae-e71dc7d59aa7',
    isFavorite: false,
    offers: [
      'c2ae2b1c-afc4-43be-8163-f88ed2cd1137',
      'cae3afff-8cb2-4490-b611-a0c25baac039'
    ],
    type: 'drive'
  },
  {
    id: 'e1ccdcdd-d790-4c13-9482-828537be9e1e',
    basePrice: 2000,
    dateFrom: '2025-03-04T07:52:11.060Z',
    dateTo: '2025-03-05T01:21:11.060Z',
    destination: 'c8eab9ce-c072-4114-9412-76f8023ba638',
    isFavorite: false,
    offers: [
      '8309542d-7494-4299-a93c-32a2b4c982c2',
      'f0d18307-8693-4c1a-b25b-043b3c1b9ed1',
      'f9e6902f-48b3-4f5b-9755-2cf03531e149'
    ],
    type: 'ship'
  },
  {
    id: '81ccd6dd-d790-4c13-9482-823537be9e1e',
    basePrice: 50,
    dateFrom: '2025-03-08T07:52:11.060Z',
    dateTo: '2025-03-09T01:21:11.060Z',
    destination: 'c8eab9ce-c072-4114-9412-76f8023ba638',
    isFavorite: false,
    offers: [],
    type: 'bus'
  }
];

const mockEvents = mockSourcedEvents.slice();

export {mockEvents};
