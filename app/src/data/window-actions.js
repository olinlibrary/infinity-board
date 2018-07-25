export const WindowActionTypes = {
  SET_WINDOW_DRAG: 'SET_WINDOW_DRAG',
  SET_PREV_WINDOW_POSITION: 'SET_PREV_WINDOW_POSITION',
  SET_CURSOR: 'SET_CURSOR',
  SET_WINDOW_POS: 'SET_WINDOW_POS',
  SET_OVER_DELETE: 'SET_OVER_DELETE',
  SET_MOUSE_MOVE: 'SET_MOUSE_MOVE',
  UPDATE_CLIENTS: 'UPDATE_CLIENTS',
};

export function setWindowDrag(val) {
  return { type: WindowActionTypes.SET_WINDOW_DRAG, val };
}

export function setPrevWindowPosition(xVal, yVal) {
  return { type: WindowActionTypes.SET_PREV_WINDOW_POSITION, xVal, yVal };
}

export function setCursor(cursor) {
  return { type: WindowActionTypes.SET_CURSOR, cursor };
}

export function setWindowPos(xVal, yVal, innerWidth, innerHeight) {
  // eslint-disable-next-line
  return { type: WindowActionTypes.SET_WINDOW_POS, xVal, yVal, innerWidth, innerHeight };
}

export function setOverDelete(val) {
  return { type: WindowActionTypes.SET_OVER_DELETE, val };
}

export function setMouseMove(val) {
  return { type: WindowActionTypes.SET_MOUSE_MOVE, val };
}

export function updateClients(clients) {
  return { type: WindowActionTypes.UPDATE_CLIENTS, clients };
}
