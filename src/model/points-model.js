import { getRandomArrayElement } from '../utils.js';
import { destinations } from '../mock/destinations.js';
import { offers } from '../mock/offers.js';
import { points } from '../mock/points.js';

const POINTS_COUNT = 3;

export default class PointsModel {
  #destinations = destinations;
  #offers = offers;
  #points = Array.from({length: POINTS_COUNT}, () => getRandomArrayElement(points));

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }
}
