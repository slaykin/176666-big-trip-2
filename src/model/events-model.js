import Observable from '../framework/observable.js';
import {mockEvents} from '../mock/mock-events.js';

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

const defaultEvent = {
  id: '',
  basePrice: 0,
  dateFrom: new Date().setHours(0,0,0,0),
  dateTo: new Date().setHours(1,0,0,0),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};


export default class EventsModel extends Observable {
  #events = [];

  init() {
    this.#events = mockEvents;
  }

  get events() {
    return this.#events;
  }

  get eventTypes() {
    return [...EVENT_TYPES];
  }

  get defaultEvent() {
    return structuredClone(defaultEvent);
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
