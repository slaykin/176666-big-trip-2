import {render} from './framework/render.js';
import {generateFilters} from './mock/mock-filters.js';
import DestinationsModel from './model/destinations-model.js';
import EventsModel from './model/events-model.js';
import OffersModel from './model/offers-model.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';


const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');
const eventCreateElement = document.querySelector('.trip-main__event-add-btn');

const destinationsModel = new DestinationsModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,
  eventCreate: eventCreateElement,
  destinationsModel,
  eventsModel,
  offersModel,
});


destinationsModel.init();
eventsModel.init();
offersModel.init();
tripPresenter.init();


const filters = generateFilters(eventsModel.events);
render(new FilterView({filters}), filtersElement);
