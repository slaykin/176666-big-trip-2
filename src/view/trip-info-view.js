import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(tripTitle, tripDuration, tripTotalCost) {
  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>
        <p class="trip-info__dates">${tripDuration}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalCost}</span>
      </p>
    </section>
  `);
}

export default class TripInfoView extends AbstractView {
  #tripTitle = null;
  #tripDuration = null;
  #tripTotalCost = null;

  constructor({tripTitle, tripDuration, tripTotalCost}) {
    super();
    this.#tripTitle = tripTitle;
    this.#tripDuration = tripDuration;
    this.#tripTotalCost = tripTotalCost;
  }

  get template() {
    return createTripInfoTemplate(
      this.#tripTitle,
      this.#tripDuration,
      this.#tripTotalCost,
    );
  }
}
