import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';

const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-body__page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const tripPresenter = new TripPresenter({tripContainer: pageBodyContainerElement});

render(new FilterView(), filtersElement);
tripPresenter.init();
