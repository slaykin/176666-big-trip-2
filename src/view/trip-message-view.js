import AbstractView from '../framework/view/abstract-view';

function createTripMessageViewTemplate(message) {
  return (
    `<p class="trip-events__msg">${message}</p>`
  );
}

export default class TripMessageView extends AbstractView {
  #message = null;

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createTripMessageViewTemplate(this.#message);
  }
}
