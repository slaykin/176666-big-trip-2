import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isEscapeKey} from '../utils/common.js';
import EventCreateView from '../view/event-create-view.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #eventCreateComponent = null;
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #handleEventUpdate = null;
  #handleNewEventClose = null;

  constructor({
    eventListContainer,
    destinationsModel,
    eventsModel,
    offersModel,
    handleEventUpdate,
    handleNewEventClose
  }) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#handleEventUpdate = handleEventUpdate;
    this.#handleNewEventClose = handleNewEventClose;
  }

  init() {
    if (this.#eventCreateComponent !== null) {
      return;
    }

    const blankEvent = this.#eventsModel.blankEvent;

    this.#eventCreateComponent = new EventCreateView({
      event: blankEvent,
      currentDestination: this.#destinationsModel.getDestinationById(blankEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(blankEvent.type),
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      eventTypes: this.#eventsModel.eventTypes,
      handleFormSubmit: this.#formSubmitHandler,
      handleCancelClick: this.#cancelClickHandler
    });
    render(this.#eventCreateComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventCreateComponent === null) {
      return;
    }
    this.#handleNewEventClose();
    remove(this.#eventCreateComponent);
    this.#eventCreateComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#eventCreateComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventCreateComponent.updateElement({
        isDisabled: false,
        isSaving: false
      });
    };

    this.#eventCreateComponent.shake(resetFormState);
  }

  #formSubmitHandler = (event) => {
    this.#handleEventUpdate(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt) &&
        document.activeElement.tagName !== 'INPUT') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
