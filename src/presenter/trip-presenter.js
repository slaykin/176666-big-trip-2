import { render } from '../render.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointAddView from '../view/point-add-view.js';
import PointEditView from '../view/point-edit-view.js';
// import PonintListEmptyView from '../view/point-list-empty-view.js';
// import PointListLoadingView from '../view/point-list-loading-view.js';

export default class TripPresenter {
  tripComponent = new TripView();
  eventListComponent = new PointListView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());
    render(this.eventListComponent, this.tripComponent.getElement());
    render(new PointEditView(), this.eventListComponent.getElement());
    render(new PointAddView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i ++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
