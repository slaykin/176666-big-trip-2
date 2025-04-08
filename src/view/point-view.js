import {getDay, getTime, getEventDuration} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createOfferTemplate(offer) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  );
}

function createOfferListTempate(offers) {
  if (offers.length > 0) {
    return (
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${(offers.map(createOfferTemplate)).join('')}
      </ul>`
    );
  }
  return '';
}

function favoriteButtonTemplate(isFavorite) {
  return (
    `<button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>`
  );
}

function createPointTemplate(point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = point;
  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

  const day = getDay(dateFrom);
  const iconPath = `./img/icons/${type}.png`;
  const destinationCity = pointDestination.name;
  const eventTitle = `${type} ${destinationCity}`;
  const startTime = getTime(dateFrom);
  const endTime = getTime(dateTo);
  const eventDuration = getEventDuration(dateFrom, dateTo);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${day}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${iconPath}" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createOfferListTempate(pointOffers)}
        ${favoriteButtonTemplate(isFavorite)}
        <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;#handleFavoriteClick = null;

  constructor({point, destinations, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
