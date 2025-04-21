import {getCapitalizedString} from '../utils/common-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  const {type, count} = filter;
  const isDisabled = count === 0 ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isDisabled}>
      <label class="trip-filters__filter-label" for="filter-${type}">${getCapitalizedString(type)}</label>
    </div>`
  );
}

function createFilterTemplate(filters) {
  const filterItemTemplates = filters.map((filter) => createFilterItemTemplate(filter)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemTemplates}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}){
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
