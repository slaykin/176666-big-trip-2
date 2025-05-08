import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isEscapeKey} from '../utils/common.js';
import {isSameDate} from '../utils/date.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class EventPresenter {
  #eventListContainer = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #mode = Mode.DEFAULT;
  #event = null;
  #currentDestination = null;
  #currentOffersPack = null;
  #checkedOffers = null;
  #allDestinations = null;
  #allOffersPacks = null;
  #eventTypes = null;
  #handleViewAction = null;
  #handleModeChange = null;

  constructor({
    eventListContainer,
    allDestinations,
    allOffersPacks,
    eventTypes,
    handleViewAction,
    handleModeChange
  }) {
    this.#eventListContainer = eventListContainer;
    this.#allDestinations = allDestinations;
    this.#allOffersPacks = allOffersPacks;
    this.#eventTypes = eventTypes;
    this.#handleViewAction = handleViewAction;
    this.#handleModeChange = handleModeChange;
  }

  init({
    event,
    currentDestination,
    currentOffersPack,
    checkedOffers
  }) {
    this.#event = event;
    this.#currentDestination = currentDestination;
    this.#currentOffersPack = currentOffersPack;
    this.#checkedOffers = checkedOffers;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      currentDestination: this.#currentDestination,
      checkedOffers: this.#checkedOffers,
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
      replace(this.#eventComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event, this.#currentDestination, this.#currentOffersPack);
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
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
    const isMinorUpdate = !isSameDate(this.#event.dateFrom, event.dateFrom) ||
    !isSameDate(this.#event.dateTo, event.dateTo) ||
    (this.#event.basePrice !== event.basePrice);

    this.#handleViewAction(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event
    );
  };

  #deleteClickHandler = (event) => {
    this.#handleViewAction(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event
    );
  };
}
