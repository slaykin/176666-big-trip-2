import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointAddView from '../view/point-add-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  tripComponent = new TripView();
  pointListComponent = new PointListView();

  constructor({tripContainer, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = [...this.pointsModel.getPoints()];
    const destinations = [...this.pointsModel.getDestinations()];
    const offers = [...this.pointsModel.getOffers()];

    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());
    render(this.pointListComponent, this.tripComponent.getElement());
    render(new PointEditView({point: points[0], destinations, offers}), this.pointListComponent.getElement());
    render(new PointAddView(), this.pointListComponent.getElement());

    for (const point of points) {
      render(new PointView({point, destinations, offers}), this.pointListComponent.getElement());
    }
  }
}
