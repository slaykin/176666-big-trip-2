import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offersPacks = [];
  #isLoading = true;
  #isError = false;

  constructor({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offersPacks() {
    return this.#offersPacks;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isError() {
    return this.#isError;
  }

  async init() {
    try {
      const offersPacks = await this.#offersApiService.offers;
      this.#offersPacks = offersPacks;
    } catch(err) {
      this.#offersPacks = [];
      this.#isError = true;
    }

    this.#isLoading = false;
    this._notify(UpdateType.INIT);
  }

  getOffersPackByType(type) {
    return this.#offersPacks.find((offersPack) => offersPack.type === type);
  }

  getSelectedOffers(event) {
    const offersPack = this.getOffersPackByType(event.type);
    return offersPack.offers.filter((offer) => event.offers.includes(offer.id));
  }
}
