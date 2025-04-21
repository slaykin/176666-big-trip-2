import AbstractView from './abstract-view.js';

/**
 * Абстрактный класс представления с состоянием
 */
export default class AbstractStatefulView extends AbstractView {
  /** @type {Object} Объект состояния */
  _state = {};

  /**
   * Метод для обновления состояния и перерисовки элемента
   * @param {Object} update Объект с обновлённой частью состояния
   */
  updateElement(update) {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  }

  /**
   * Метод для восстановления обработчиков после перерисовки элемента
   * @abstract
   */
  _restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  /**
   * Метод для обновления состояния
   * @param {Object} update Объект с обновлённой частью состояния
   */
  _setState(update) {
    this._state = structuredClone({...this._state, ...update});
  }

  /**
   * Метод для преобразования События в Состояние
   * @param {Object} event Событие
   * @returns {{state: Object}} Состояние
   */
  _parseEventToState(event) {
    return {...event};
  }

  /**
 * Метод для преобразования Состояния в Событие
 * @param {Object} state Состояние
 * @returns {{event: Object}} Событие
 */
  _parseStateToEvent(state) {
    return {...state};
  }

  /** Метод для перерисовки элемента */
  #rerenderElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }
}
