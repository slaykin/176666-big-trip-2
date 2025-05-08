import {render, RenderPosition, remove} from '../framework/render.js';
import {DateFormat, getFormattedDate} from '../utils/date.js';
import TripInfoView from '../view/trip-info-view.js';

const TRIP_POINTS_PREVIEW_MAX_LENGTH = 3;

export default class TripInfoPresenter {
  #tripMainContainer = null;
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor({
    tripMainContainer,
    destinationsModel,
    eventsModel,
    offersModel
  }) {
    this.#tripMainContainer = tripMainContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;

    this.#destinationsModel.addObserver(this.#modelUpdateHandler);
    this.#eventsModel.addObserver(this.#modelUpdateHandler);
    this.#offersModel.addObserver(this.#modelUpdateHandler);
  }

  init() {
    if (this.#tripInfoComponent) {
      this.#clearTripInfo();
    }

    this.#renderTripInfo();
  }

  #renderTripInfo() {
    if (this.#eventsModel.isError ||
      this.#destinationsModel.isError ||
      this.#offersModel.isError) {
      return;
    }

    if (this.#eventsModel.isLoading ||
       this.#destinationsModel.isLoading ||
       this.#offersModel.isLoading) {
      return;
    }

    if (this.#eventsModel.events.length === 0) {
      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      tripTitle: this.#getTripTitle(),
      tripDuration: this.#getTripDuration(),
      tripTotalCost: this.#getTripTotalCost(),
    });

    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
  }

  #getTripTitle() {
    let events = [];
    let separator = '';

    if (this.#eventsModel.events.length <= TRIP_POINTS_PREVIEW_MAX_LENGTH){
      events = [...this.#eventsModel.events];
      separator = ' — ';
    }

    if (this.#eventsModel.events.length > TRIP_POINTS_PREVIEW_MAX_LENGTH){
      events = [this.#eventsModel.events[0], this.#eventsModel.events.at(-1)];
      separator = ' — ... — ';
    }

    const destinationsNames = events.map((event) => this.#destinationsModel.getDestinationById(event.destination).name);

    return destinationsNames.join(separator);
  }

  #getTripDuration() {
    const firstEvent = this.#eventsModel.events[0];
    const lastEvent = this.#eventsModel.events.at(-1);

    const tripStartDate = getFormattedDate(firstEvent.dateFrom, DateFormat.TRIP_DATE);
    const tripEndDate = getFormattedDate(lastEvent.dateTo, DateFormat.TRIP_DATE);

    return `${tripStartDate} — ${tripEndDate}`;
  }

  #getEventTotalCost(event) {
    const checkedOffers = this.#offersModel.getSelectedOffers(event);
    const offersTotalCost = checkedOffers.map((offer) => offer.price).reduce((sum, price) => (sum += price), 0);

    return event.basePrice + offersTotalCost;
  }

  #getTripTotalCost() {
    let tripTotalCost = 0;

    this.#eventsModel.events.forEach((event) => {
      tripTotalCost += this.#getEventTotalCost(event);
    });

    return tripTotalCost;
  }

  #modelUpdateHandler = () => {
    this.init();
  };
}
