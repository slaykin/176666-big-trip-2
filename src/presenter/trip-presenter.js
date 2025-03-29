import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace} from '../framework/render.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;

  #tripComponent = new TripView();
  #pointListComponent = new PointListView();

  #tripPoints = [];
  #tripDestinations = [];
  #tripOffers = [];

  constructor({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#tripDestinations = [...this.#pointsModel.destinations];
    this.#tripOffers = [...this.#pointsModel.offers];

    this.#renderTrip();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destinations: this.#tripDestinations,
      offers: this.#tripOffers,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      destinations: this.#tripDestinations,
      offers: this.#tripOffers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);
    render(new SortView(), this.#tripComponent.element);
    render(this.#pointListComponent, this.#tripComponent.element);

    for (const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  }
}
