import AbstractView from '../framework/view/abstract-view.js';

function createPointListLoadingTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class PointListLoadingView extends AbstractView {
  get template() {
    return createPointListLoadingTemplate();
  }
}
