import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import EventSort from '../utils/sort.js';
import EventPresenter from '../presenter/event-presenter.js';
import NewEventPresenter from '../presenter/new-event-presenter.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import TripMessageView from '../view/trip-message-view.js';

const LOADING_MESSAGE = 'Loading...';
const LOADING_ERROR_MESSAGE = 'Failed to load latest route information';

const UiBlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripMainContainer = null;
  #tripContainer = null;
  #tripComponent = new TripView();
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #currentMessageComponent = null;
  #prevMessageComponent = null;
  #newEventButtonComponent = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #filtersModel = null;
  #currentSortType = null;
  #currentFilterType = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: UiBlockerTimeLimit.LOWER_LIMIT,
    upperLimit: UiBlockerTimeLimit.UPPER_LIMIT
  });

  constructor({
    tripMainContainer,
    tripContainer,
    destinationsModel,
    eventsModel,
    offersModel,
    filtersModel,
  }) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;
    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListComponent.element,
      destinationsModel: destinationsModel,
      eventsModel: eventsModel,
      offersModel: offersModel,
      handleEventUpdate: this.#viewActionHandler,
      handleNewEventClose: this.#newEventCloseHandler,
    });

    this.#newEventButtonComponent = new NewEventButtonView({
      handleNewEventOpen: this.#newEventOpenHandler,
    });

    this.#eventsModel.addObserver(this.#modelUpdateHandler);
    this.#destinationsModel.addObserver(this.#modelUpdateHandler);
    this.#offersModel.addObserver(this.#modelUpdateHandler);
    this.#filtersModel.addObserver(this.#modelUpdateHandler);

    this.#currentSortType = EventSort.defaultSortType;
    this.#currentFilterType = this.#filtersModel.filterType;
  }

  get events () {
    this.#currentFilterType = this.#filtersModel.filterType;
    const events = this.#eventsModel.events;
    const filteredEvents = this.#filtersModel.filterMethods[this.#currentFilterType](events);

    EventSort.sortEvents(filteredEvents, this.#currentSortType);

    return filteredEvents;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offersPacks() {
    return this.#offersModel.offersPacks;
  }

  init() {
    render(this.#eventListComponent, this.#tripComponent.element);
    this.#renderNewEventButton();
    this.#renderTrip();
  }

  #renderLoadingMessage() {
    this.#renderTripMessage(LOADING_MESSAGE);
  }

  #renderNoEventsMessage() {
    this.#renderTripMessage(this.#filtersModel.getNoEventMessage(this.#currentFilterType));
  }

  #renderLoadingErrorMessage() {
    this.#renderTripMessage(LOADING_ERROR_MESSAGE);
  }

  #renderTripMessage(message) {
    if (this.#currentMessageComponent) {
      remove(this.#currentMessageComponent);
    }

    this.#currentMessageComponent = new TripMessageView({message});
    render(this.#currentMessageComponent, this.#tripComponent.element, RenderPosition.BEFOREEND);
  }

  #renderNewEventButton() {
    render(this.#newEventButtonComponent, this.#tripMainContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortSettings: EventSort.sortSettings,
      currentSortType: this.#currentSortType,
      handleSortClick: this.#sortClickHandler
    });

    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      allDestinations: this.destinations,
      allOffersPacks: this.offersPacks,
      eventTypes: this.#eventsModel.eventTypes,
      handleViewAction: this.#viewActionHandler,
      handleModeChange: this.#modeChangeHandler
    });
    eventPresenter.init({
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type),
      checkedOffers: this.#offersModel.getSelectedOffers(event),
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if (this.#eventsModel.isError ||
       this.#destinationsModel.isError ||
       this.#offersModel.isError) {
      this.#renderLoadingErrorMessage();
      return;
    }

    if (this.#eventsModel.isLoading ||
        this.#destinationsModel.isLoading ||
        this.#offersModel.isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    this.#enableNewEventButton();
    remove(this.#currentMessageComponent);

    if (this.events.length === 0) {
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderEvents(this.events);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if (this.#currentMessageComponent) {
      remove(this.#currentMessageComponent);
      this.#currentMessageComponent = null;
    }

    if (this.#prevMessageComponent) {
      remove(this.#prevMessageComponent);
      this.#prevMessageComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = EventSort.defaultSortType;
    }
  }

  #disableNewEventButton() {
    this.#newEventButtonComponent.element.disabled = true;
  }

  #enableNewEventButton() {
    this.#newEventButtonComponent.element.disabled = false;
  }

  #modeChangeHandler = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelUpdateHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init({
          event: data,
          currentDestination: this.#destinationsModel.getDestinationById(data.destination),
          currentOffersPack: this.#offersModel.getOffersPackByType(data.type),
          checkedOffers: this.#offersModel.getSelectedOffers(data),
        });
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#renderTrip();
        break;
    }
  };

  #newEventOpenHandler = () => {
    this.#currentSortType = EventSort.defaultSortType;
    this.#filtersModel.setFilter(UpdateType.MAJOR, this.#filtersModel.defaultFilterType);
    this.#newEventPresenter.init();
    this.#disableNewEventButton();
    if (this.#currentMessageComponent) {
      this.#prevMessageComponent = this.#currentMessageComponent;
      remove(this.#currentMessageComponent);
    }
  };

  #newEventCloseHandler = () => {
    this.#enableNewEventButton();
    if (this.#prevMessageComponent) {
      this.#currentMessageComponent = this.#prevMessageComponent;
      this.#prevMessageComponent = null;
      render(this.#currentMessageComponent, this.#tripComponent.element, RenderPosition.BEFOREEND);
    }
  };

  #sortClickHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };
}
