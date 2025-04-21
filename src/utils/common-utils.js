function getCapitalizedString(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getHtmlSafeString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

function getIdGenerator () {
  let currentValue = 0;

  return function () {
    currentValue += 1;
    return currentValue;
  };
}

function updateItem(items, updatedItem) {
  return items.map((item) => item.id === updatedItem.id ? updatedItem : item);
}

function isEscapeKey (evt) {
  return evt.key === 'Escape';
}

export {
  getCapitalizedString,
  getHtmlSafeString,
  getIdGenerator,
  updateItem,
  isEscapeKey
};
