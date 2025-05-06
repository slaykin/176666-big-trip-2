import Observable from '../framework/observable.js';
import {mockOffersPacks} from '../mock/mock-offers-packs.js';


export default class OffersModel extends Observable {
  #offersPacks = [];

  init() {
    this.#offersPacks = mockOffersPacks;
  }

  get offersPacks() {
    return this.#offersPacks;
  }

  getOffersPackByType(type) {
    return this.#offersPacks.find((offersPack) => offersPack.type === type);
  }
}
