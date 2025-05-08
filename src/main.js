import {END_POINT, AUTHORIZATION} from './api.js';
import DestinationsModel from './model/destinations-model.js';
import EventsModel from './model/events-model.js';
import FiltersModel from'./model/filters-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import EventsApiService from './api-service/events-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const pageContainerElement = document.querySelector('.page-main div');

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION),
});

const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION),
});

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION),
});

const filtersModel = new FiltersModel();

const tripInfoPresenter = new TripInfoPresenter({
  tripMainContainer: tripMainElement,
  destinationsModel,
  eventsModel,
  offersModel
});

const tripPresenter = new TripPresenter({
  tripMainContainer: tripMainElement,
  tripContainer: pageContainerElement,
  destinationsModel,
  eventsModel,
  offersModel,
  filtersModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filtersModel: filtersModel,
  eventsModel: eventsModel
});


destinationsModel.init();
offersModel.init();
eventsModel.init();
tripInfoPresenter.init();
tripPresenter.init();
filterPresenter.init();
