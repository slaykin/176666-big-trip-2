import {getCapitalizedString} from '../utils/common-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortItem) {
  const {name, isAvailable, isDefault} = sortItem;
  const isChecked = isDefault ? 'checked' : '';
  const isDisabled = isAvailable ? '' : 'disabled';

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input
        id="sort-${name}"
        data-sort-type="${name}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name}"
        ${isChecked}
        ${isDisabled}>
      <label class="trip-sort__btn" for="sort-${name}">${getCapitalizedString(name)}</label>
    </div>`
  );
}

function createSortTemplate(sortTypes) {
  const sortItems = sortTypes.slice().map((sortItem) => createSortItemTemplate(sortItem)).join('');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems}
    </form>`
  );
}


export default class SortView extends AbstractView {
  #sortTypes = null;
  #onSortTypeChangeClick = null;

  constructor({sortTypes, onSortTypeChangeClick}) {
    super();
    this.#sortTypes = sortTypes;
    this.#onSortTypeChangeClick = onSortTypeChangeClick;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortTypes);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#onSortTypeChangeClick(evt.target.dataset.sortType);
  };
}
