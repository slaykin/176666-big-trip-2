import AbstractView from '../framework/view/abstract-view.js';

function createTripTemplate() {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
}

export default class TripView extends AbstractView {
  get template() {
    return createTripTemplate();
  }
}
