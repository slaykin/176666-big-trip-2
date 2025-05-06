import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType, isEscapeKey} from '../utils/common-utils.js';
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
  }){
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

    const defaultEvent = this.#eventsModel.defaultEvent;

    this.#eventCreateComponent = new EventCreateView({
      event: defaultEvent,
      currentDestination: this.#destinationsModel.getDestinationById(defaultEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(defaultEvent.type),
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

  #formSubmitHandler = (event) => {
    this.#handleEventUpdate(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {...event, id: crypto.randomUUID()},
    );
    this.destroy();
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
