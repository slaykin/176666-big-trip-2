import AbstractView from '../framework/view/abstract-view';

function createNoEventViewTemplate(noEventMessage) {
  return (
    `<p class="trip-events__msg">${noEventMessage}</p>`
  );
}

export default class NoEventView extends AbstractView {
  #noEventMessage = null;

  constructor({noEventMessage}) {
    super();
    this.#noEventMessage = noEventMessage;
  }

  get template() {
    return createNoEventViewTemplate(this.#noEventMessage);
  }
}
