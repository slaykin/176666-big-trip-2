import {getCapitalizedString, getKebabCaseString} from '../utils/common.js';
import {MILLISECONDS_IN_HOUR, EVENT_HOUR_OFFSET, DateFormat, getFlatpickrConfig, getFormattedDate} from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

function createTypeTemplate(_state, type) {
  const {id} = _state;
  const isChecked = _state.type === type ? 'checked' : '';
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${type}-${id}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">
        ${getCapitalizedString(type)}
      </label>
    </div>`
  );
}

function createEventTypesTemplate(_state, eventTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${eventTypes.map((type) => createTypeTemplate(_state, type)).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationsTemplate(destinations, id) {
  return (
    `<datalist id="destination-list-${id}">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>`
  );
}

function createOfferTemplate(_state, offer, isDisabled) {
  const {id, title, price} = offer;
  const name = getKebabCaseString(title);
  const isChecked = _state.offers.includes(id);

  return (
    `<div class="event__offer-selector">
      <input
        id="event-offer-${id}"
        class="event__offer-checkbox  visually-hidden"
        type="checkbox"
        name="event-offer-${name}"
        data-offer-id="${id}"
        value="${title}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOffersTemplate(_state, isDisabled) {
  const {currentOffersPack} = _state;
  if (!currentOffersPack) {
    return '';
  }

  return currentOffersPack.offers.length !== 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${currentOffersPack.offers.map((offer) => createOfferTemplate(_state, offer, isDisabled)).join('')}
      </div>
    </section>`
  ) : '';
}

function createPictureTemplate(picture) {
  const {src, description} = picture;

  return `<img class="event__photo" src="${src}" alt="${description}">`;
}

function createPicturesTemplate(pictures = []) {
  return pictures.length !== 0 ? (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => createPictureTemplate(picture)).join('')}
      </div>
    </div>`
  ) : '';
}

function createDestinationTemplate(destination) {
  if (!destination) {
    return '';
  }
  const {description, pictures} = destination;

  return (description !== '' || pictures.length !== 0) ? (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createPicturesTemplate(pictures)}
    </section>`) : '';
}

function createDetailsTemplate(offersTemplate, destinationTemplate) {
  return (offersTemplate !== '' || destinationTemplate !== '') ? (
    `<section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`) : '';
}

function createEventEditTemplate(_state, allDestinations, eventTypes) {
  const {id, type, dateFrom, dateTo, basePrice, currentDestination, isDisabled, isSaving, isDeleting} = _state;
  const isSubmitDisabled = !type || !currentDestination || !dateFrom || !dateTo;
  const offersTemplate = createOffersTemplate(_state, isDisabled);
  const destinationTemplate = createDestinationTemplate(currentDestination);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input
              id="event-type-toggle-${id}"
              class="event__type-toggle  visually-hidden"
              type="checkbox">
              ${isDisabled ? 'disabled' : ''}
            ${createEventTypesTemplate(_state, eventTypes)}
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${getCapitalizedString(type)}
            </label>
            <input
              id="event-destination-${id}"
              class="event__input  event__input--destination"
              type="text"
              name="event-destination"
              value="${currentDestination ? currentDestination.name : ''}"
              list="destination-list-${id}"
              ${isDisabled ? 'disabled' : ''}>
            ${createDestinationsTemplate(allDestinations, id)}
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              id="event-start-time-${id}"
              class="event__input  event__input--time"
              type="text"
              name="event-start-time"
              value="${getFormattedDate(dateFrom, DateFormat.DATE)}"
              ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              id="event-end-time-${id}"
              class="event__input  event__input--time"
              type="text"
              name="event-end-time"
              value="${getFormattedDate(dateTo, DateFormat.DATE)}"
              ${isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${id}"
              type="number"
              min="1"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset">
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createDetailsTemplate(offersTemplate, destinationTemplate)}
      </form>
    </li>`
  );
}
export default class EventEditView extends AbstractStatefulView {
  #allDestinations = null;
  #allOffersPacks = null;
  #eventTypes = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleToggleClick = null;
  constructor({
    event,
    currentDestination,
    currentOffersPack,
    allDestinations,
    allOffersPacks,
    eventTypes,
    handleFormSubmit,
    handleDeleteClick,
    handleToggleClick
  }) {
    super();
    this._setState(EventEditView.parseDataToState(event, currentDestination, currentOffersPack));
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#eventTypes = eventTypes;
    this.#handleFormSubmit = handleFormSubmit;
    this.#handleDeleteClick = handleDeleteClick;
    this.#handleToggleClick = handleToggleClick;
    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this.#allDestinations,
      this.#eventTypes
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(event, currentDestination, currentOffersPack) {
    this.updateElement(EventEditView.parseDataToState(event, currentDestination, currentOffersPack));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toggleClickHandler);
    [...this.element.querySelectorAll('.event__offer-checkbox')]
      .map((input) => input.addEventListener('change', this.#offerChangeHandler));

    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  #setDateFromPicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        ...getFlatpickrConfig(),
        onClose: this.#dateFromCloseHandler,
      },
    );
  }

  #setDateToPicker() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        ...getFlatpickrConfig(),
        minDate: this._state.dateFrom,
        onClose: this.#dateToCloseHandler,
      },
    );
  }

  #dateFromCloseHandler = ([userDate]) => {
    const dateFrom = userDate ? userDate : new Date();
    let dateTo = this._state.dateTo;

    if (dateTo && dateFrom >= dateTo) {
      dateTo = dateFrom.valueOf() + (EVENT_HOUR_OFFSET * MILLISECONDS_IN_HOUR);

      this.updateElement({
        dateFrom: dateFrom,
        dateTo: new Date(dateTo),
      });
    } else {
      this.updateElement({
        dateFrom: dateFrom,
      });
    }
  };

  #dateToCloseHandler = ([userDate]) => {
    const dateTo = userDate ? userDate : new Date();

    this.updateElement({
      dateTo: dateTo,
    });
  };

  #typeClickHandler = (evt) => {
    const targetInput = evt.target.closest('input');
    const typeToggle = this.element.querySelector('.event__type-toggle');

    if (targetInput) {
      evt.stopPropagation();
      evt.preventDefault();

      const newType = targetInput.value;

      if (newType !== this._state.type) {
        this.updateElement({
          type: newType,
          offers: [],
          currentOffersPack: this.#allOffersPacks.find((offersPack) => offersPack.type === newType)
        });
      }
      typeToggle.checked = false;
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const newDestination = this.#allDestinations.find((destination) => destination.name === newDestinationName);

    if (newDestination && this._state.currentDestination !== newDestination) {
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

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditView.parseStateToData(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToData(this._state));
  };

  #toggleClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleToggleClick();
  };

  #offerChangeHandler = (evt) => {
    const targetOffer = evt.target.dataset.offerId;
    let checkedOffers = [...this._state.offers];

    if (checkedOffers.includes(targetOffer)) {
      checkedOffers = checkedOffers.filter((offer) => offer !== targetOffer);
    } else {
      checkedOffers.push(targetOffer);
    }

    this._setState({
      offers: checkedOffers,
    });
  };

  static parseDataToState(event, currentDestination, currentOffersPack) {
    const state = {
      ...event,
      currentDestination,
      currentOffersPack,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };

    return state;
  }

  static parseStateToData(state) {
    const event = {...state};

    delete event.currentDestination;
    delete event.currentOffersPack;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
