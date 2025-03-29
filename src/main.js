import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import { render } from './framework/render.js';

const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-body__page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,
  pointsModel,
});

render(new FilterView(), filtersElement);

tripPresenter.init();
