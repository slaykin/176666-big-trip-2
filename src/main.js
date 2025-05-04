import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import EventsModel from './model/events-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from'./model/filters-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';


const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = document.querySelector('.trip-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const destinationsModel = new DestinationsModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,

  destinationsModel,
  eventsModel,
  offersModel,
  filtersModel,
  handleNewEventClose: newEventCloseHandler
});
const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filtersModel: filtersModel,
  eventsModel: eventsModel
});


const newEventButtonComponent = new NewEventButtonView({
  handleNewEventOpen: newEventOpenHandler
});

function newEventCloseHandler() {
  newEventButtonComponent.element.disabled = false;
}

function newEventOpenHandler() {
  tripPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, tripMainElement);


destinationsModel.init();
eventsModel.init();
offersModel.init();

filterPresenter.init();
tripPresenter.init();
