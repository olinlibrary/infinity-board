export const WindowActionTypes = {
  SET_WINDOW_DRAG: 'SET_WINDOW_DRAG',
  SET_PREV_WINDOW_POSITION: 'SET_PREV_WINDOW_POSITION',
  SET_CURSOR: 'SET_CURSOR',
  SET_WINDOW_POS: 'SET_WINDOW_POS',
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

export function setWindowPos(xVal, yVal) {
  return {type: WindowActionTypes.SET_WINDOW_POS, xVal, yVal };
}
