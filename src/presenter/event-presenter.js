import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType, isEscapeKey} from '../utils/common-utils.js';
import {isDatesEqual} from '../utils/date-utils.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing'
};

export default class EventPresenter {
  #eventListContainer = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #mode = Mode.DEFAULT;
  #event = null;

  #currentDestination = null;
  #currentOffersPack = null;
  #allDestinations = null;
  #allOffersPacks = null;
  #eventTypes = null;

  #handleViewAction = null;
  handleModeChange = null;

  constructor({
    eventListContainer,
    allDestinations,
    allOffersPacks,
    eventTypes,
    handleViewAction,
    handleModeChange
  }){
    this.#eventListContainer = eventListContainer;
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#eventTypes = eventTypes;
    this.#handleViewAction = handleViewAction;
    this.handleModeChange = handleModeChange;
  }

  init({event, currentDestination, currentOffersPack}) {
    this.#event = event;
    this.#currentDestination = currentDestination;
    this.#currentOffersPack = currentOffersPack;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      handleFavoriteClick: this.#favoriteClickHandler,
      handleToggleClick: this.#toggleShowClickHandler
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      currentOffersPack: this.#currentOffersPack,
      allDestinations:  this.#allDestinations,
      allOffersPacks: this.#allOffersPacks,
      eventTypes: this.#eventTypes,
      handleFormSubmit: this.#formSubmitHandler,
      handleDeleteClick: this.#deleteClickHandler,
      handleToggleClick: this.#toggleHideClickHandler,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt) &&
        document.activeElement.tagName !== 'INPUT') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
      this.#replaceFormToCard();
    }
  };

  #toggleShowClickHandler = () => {
    this.#replaceCardToForm();
  };

  #toggleHideClickHandler = () => {
    this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
    this.#replaceFormToCard();
  };

  #favoriteClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite}
    );
  };

  #formSubmitHandler = (event) => {
    const isMinorUpdate = !isDatesEqual(this.#event.dateFrom, event.dateFrom) ||
    !isDatesEqual(this.#event.dateTo, event.dateTo) ||
    (this.#event.basePrice !== event.basePrice);

    this.#handleViewAction(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event
    );
    this.#replaceFormToCard();
  };

  #deleteClickHandler = (event) => {
    this.#handleViewAction(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event
    );
  };
}
