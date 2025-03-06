import { createElement } from '../render.js';

function createPointListLoadingTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class EventListLoadingView {
  getTemplate() {
    return createPointListLoadingTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
