import AbstractView from '../framework/view/abstract-view';

function createNoEventViewTemplate() {
  return (
    '<p class="trip-events__msg">Click New Event to create your first point</p>'
  );
}

export default class NoEventView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createNoEventViewTemplate();
  }
}
