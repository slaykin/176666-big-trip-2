import {getCapitalizedString} from '../utils/common-utils.js';
import {DateFormat, getFormattedDate, getFormattedDuration} from '../utils/date-utils.js';
import AbstractView from '../framework/view/abstract-view.js';


function createOfferTemplate(offer) {
  const {title, price} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  );
}

function createoffersCheckedListTemplate(event, offersPack) {
  const checkedOffers = offersPack.offers.filter((offer) => event.offers.includes(offer.id));

  return checkedOffers.length !== 0 ? (
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${checkedOffers.map((offer) => createOfferTemplate(offer)).join('')}
      </ul>`
  ) : '';
}

function createEventTemplate(event, currentDestination, currentOffersPack) {
  const {id, type, dateFrom, dateTo, basePrice} = event;
  const day = getFormattedDate(dateFrom, DateFormat.DAY);
  const timeFrom = getFormattedDate(dateFrom, DateFormat.TIME);
  const timeTo = getFormattedDate(dateTo, DateFormat.TIME);
  const duration = getFormattedDuration(dateFrom, dateTo);
  const isFavorite = event.isFavorite ? ' event__favorite-btn--active' : '';
  const currentDestinationName = currentDestination ? currentDestination.name : '';

  return (
    `<li class="trip-events__item">
      <div id = "${id}" class="event">
        <time class="event__date" datetime="${dateFrom}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getCapitalizedString(type)} ${currentDestinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createoffersCheckedListTemplate(event, currentOffersPack)}
        <button class="event__favorite-btn${isFavorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688
                    14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventView extends AbstractView {
  #event = null;
  #currentDestination = null;
  #currentOffersPack = null;
  #handleFavoriteClick = null;
  #handleToggleClick = null;

  constructor({event,
    currentDestination,
    currentOffersPack,
    handleFavoriteClick,
    handleToggleClick
  }){
    super();
    this.#event = event;
    this.#currentDestination = currentDestination;
    this.#currentOffersPack = currentOffersPack;
    this.#handleFavoriteClick = handleFavoriteClick;
    this.#handleToggleClick = handleToggleClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toggleClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(
      this.#event,
      this.#currentDestination,
      this.#currentOffersPack,
    );
  }

  #toggleClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleToggleClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
