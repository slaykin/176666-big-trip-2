import {DateFormat, EVENT_TYPES, flatpickrConfig} from '../const.js';
import {getCapitalizedString, getHtmlSafeString} from '../utils/common-utils.js';
import {getFormattedDate} from '../utils/date-utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';


function createTypeTemplate(_state, type) {
  const {id} = _state;
  const isChecked = _state.type === type ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createEventTypeListTemplate(_state, eventTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((type) => createTypeTemplate(_state, type)).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationListTemplate(destinations, id) {
  return (
    `<datalist id="destination-list-${id}">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>`
  );
}

function createOfferTemplate(_state, offer) {
  const {id} = _state;
  const {title, price} = offer;
  const offerHtmlTitle = getHtmlSafeString(title);
  const isChecked = _state.offers.includes(offer.id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input
        id="event-offer-${offerHtmlTitle}-${id}"
        class="event__offer-checkbox  visually-hidden"
        type="checkbox"
        name="event-offer-${offerHtmlTitle}"
        data-offer-id="${offer.id}"
        value="${title}"
        ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offerHtmlTitle}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOfferListTemplate(_state) {
  const {currentOffersPack} = _state;

  return currentOffersPack.offers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${currentOffersPack.offers.map((offer) => createOfferTemplate(_state, offer)).join('')}
      </div>
    </section>`
  ) : '';
}

function createPicturesListTemplate(pictures = []) {
  return pictures.length !== 0 ? (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  ) : '';
}

function createDestinationTemplate(destination) {
  if(!destination) {
    return '';
  }
  const {description, pictures} = destination;

  if (description !== '' || pictures.length !== 0) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${createPicturesListTemplate(pictures)}
      </section>`);
  } else {
    return '';
  }
}

function createEventEditTemplate(_state, allDestinations) {
  const {id, type, dateFrom, dateTo, basePrice, currentDestination} = _state;
  const isSubmitDisabled = !type || !currentDestination;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
            ${createEventTypeListTemplate(_state, EVENT_TYPES)}
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${getCapitalizedString(type)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${currentDestination ? currentDestination.name : ''}"
              list="destination-list-${id}">
              ${createDestinationListTemplate(allDestinations, id)}
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormattedDate(dateFrom, DateFormat.DATE)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormattedDate(dateTo, DateFormat.DATE)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn btn btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${createOfferListTemplate(_state)}
          ${createDestinationTemplate(currentDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class EventEditView extends AbstractStatefulView {

  #allDestinations = null;
  #allOffersPacks = null;
  #datepicker = null;
  #toggleClickHandler = null;
  #formSubmitHandler = null;

  constructor({
    event,
    currentDestination,
    currentOffersPack,
    allDestinations,
    allOffersPacks,
    toggleClickHandler,
    formSubmitHandler}){
    super();
    this._setState(EventEditView.parseEventToState(event, currentDestination, currentOffersPack));
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#toggleClickHandler = toggleClickHandler;
    this.#formSubmitHandler = formSubmitHandler;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this.#allDestinations
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(event, currentDestination, currentOffersPack) {
    this.updateElement(EventEditView.parseEventToState(event, currentDestination, currentOffersPack));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onToggleClick);
    this.element.querySelector('.event__type-list').addEventListener('click', this.#onTypeClick);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
    if(this._state.currentOffersPack.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#onOffersClick);
    }

    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  #setDateFromPicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        ...flatpickrConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#onDateFromClose,
      },
    );
  }

  #setDateToPicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        ...flatpickrConfig,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#onDateToClose,
      },
    );
  }

  #onToggleClick = (evt) => {
    evt.preventDefault();
    this.#toggleClickHandler();
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#formSubmitHandler(EventEditView.parseStateToEvent(this._state));
  };

  #onTypeClick = (evt) => {
    const targetInput = evt.target.closest('input');
    const typeToggle = this.element.querySelector('.event__type-toggle');

    if(targetInput) {
      evt.stopPropagation();
      evt.preventDefault();

      const newType = targetInput.value;

      if(newType !== this._state.type) {
        this.updateElement({
          type: newType,
          offers: [],
          currentOffersPack: this.#allOffersPacks.find((offersPack) => offersPack.type === newType)
        });
      }

      typeToggle.checked = false;
    }
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const newDestination = this.#allDestinations.find((destination) => destination.name === newDestinationName);

    if(newDestination && this._state.currentDestination !== newDestination) {
      this.updateElement({
        destination: newDestination.id,
        currentDestination: newDestination
      });
    } else {

      this.updateElement({
        destination: '',
        currentDestination: null
      });
    }
  };

  #onDateFromClose = ([userDate]) => {
    const newFromDate = new Date(userDate);
    const oldToDate = new Date(this._state.dateTo);

    this.updateElement({
      dateFrom: userDate,
      dateTo: oldToDate < newFromDate ? userDate : this._state.dateTo
    });
  };

  #onDateToClose = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #onPriceChange = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this.updateElement({
      basePrice: newPrice,
    });
  };

  #onOffersClick = (evt) => {
    const targetInput = evt.target.closest('input');
    if(targetInput) {
      evt.stopPropagation();
      const targetOfferId = targetInput.dataset.offerId;
      const isIncludes = this._state.offers.includes(targetOfferId);

      if(isIncludes) {
        this.updateElement({
          offers: [...this._state.offers.filter((offer) => offer !== targetOfferId)],
        });
      } else {
        this.updateElement({
          offers: [...this._state.offers, targetOfferId],
        });
      }
    }
  };

  static parseEventToState(event, currentDestination, currentOffersPack) {
    const state = {
      ...event,
      currentDestination,
      currentOffersPack
    };

    return state;
  }

  static parseStateToEvent(state) {
    const event = {...state};

    delete event.currentDestination;
    delete event.currentOffersPack;

    return event;
  }
}
