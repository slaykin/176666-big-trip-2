import {mockDestinations} from '../mock/mock-destinations.js';


export default class DestinationsModel {
  #destinations = [];

  init() {
    this.#destinations = mockDestinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
