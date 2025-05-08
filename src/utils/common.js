function getKebabCaseString(data) {
  return data.replace(/\s+/g, '-').toLowerCase();
}

function getCapitalizedString(data) {
  return data[0].toUpperCase() + data.slice(1);
}

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

export {
  getKebabCaseString,
  getCapitalizedString,
  isEscapeKey,
};
