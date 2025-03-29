import AbstractView from '../framework/view/abstract-view.js';
import { getFullDate } from '../utils';
import { EVENT_TYPES } from '../const';
import { transformIntoKebabCase, capitalizeString, idGenerator } from '../utils';

const elementId = idGenerator();

function createEventTypeTemplate(eventType) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${eventType}-${elementId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${elementId}">${capitalizeString(eventType)}</label>
    </div>`
  );
}

function createEventTypeListTemplate(eventTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map(createEventTypeTemplate).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationListTemplate(destinations) {
  return (
    `<datalist id="destination-list-${elementId}">
      ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
    </datalist>`
  );
}

function createEventOfferTemplate(offer, selectedOffers) {
  const isOfferSelected = selectedOffers.map((selectedOffer) => selectedOffer.id).includes(offer.id);
  const offerTitleInKebabCase = transformIntoKebabCase(offer.title);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitleInKebabCase}-${elementId}" type="checkbox" name="event-offer-${offerTitleInKebabCase}" ${isOfferSelected ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offerTitleInKebabCase}-${elementId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createEventOffersTemplate(allOffers, selectedOffers) {
  if (allOffers.length > 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${(allOffers.map((offer) => createEventOfferTemplate(offer, selectedOffers))).join('')}
        </div>
      </section>`
    );
  }
  return '';
}

function createEventDestinationTemplate(destination) {
  if (destination.description.length > 0) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
      </section>`
    );
  }
  return '';
}

function createPointEditTemplate(point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

  const iconPath = `./img/icons/${type}.png`;
  const destinationCity = pointDestination.name;
  const startTime = getFullDate(dateFrom);
  const endTime = getFullDate(dateTo);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${elementId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${iconPath}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${elementId}" type="checkbox">
            ${createEventTypeListTemplate(EVENT_TYPES)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${elementId}">
              ${capitalizeString(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${elementId}" type="text" name="event-destination" value="${destinationCity}" list="destination-list-${elementId}">
            ${createDestinationListTemplate(destinations)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${elementId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${elementId}" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${elementId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${elementId}" type="text" name="event-end-time" value="${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${elementId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${elementId}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createEventOffersTemplate(typeOffers, pointOffers)}
          ${createEventDestinationTemplate(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({point, destinations, offers, onFormSubmit, onEditClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
