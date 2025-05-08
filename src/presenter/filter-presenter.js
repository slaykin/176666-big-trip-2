import {render, remove, replace} from '../framework/render.js';
import {UpdateType} from '../const.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filtersModel = null;
  #eventsModel = null;

  constructor({filterContainer, filtersModel, eventsModel}) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const events = this.#eventsModel.events;
    return Object.values(this.#filtersModel.filterTypes).map((type) => ({
      type,
      count: this.#filtersModel.filterMethods[type](events).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filtersModel.filterType,
      handleFilterClick: this.#filterClickHandler
    });
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };

  #filterClickHandler = (filterType) => {
    if (this.#filtersModel.filterType === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
