import { NoEventsText } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createPointListEmptyTemplate() {
  return (
    `<p class="trip-events__msg">
    ${NoEventsText.EVERYTHING}
    </p>`
  );
}

export default class PointListEmptyView extends AbstractView {
  get template() {
    return createPointListEmptyTemplate();
  }
}
