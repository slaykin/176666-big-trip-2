const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

function getCapitalizedString(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getHtmlSafeString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

function isEscapeKey (evt) {
  return evt.key === 'Escape';
}

export {
  UserAction,
  UpdateType,
  getCapitalizedString,
  getHtmlSafeString,
  isEscapeKey
};
