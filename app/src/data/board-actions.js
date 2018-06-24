
export const BoardActionTypes = {
  SET_MOUSE_CLICK_POSITION: 'SET_MOUSE_CLICK_POSITION',
  SET_DRAGGING: 'SET_DRAGGING',
  SET_POSITION: 'SET_POSITION',
  SET_SIZE: 'SET_SIZE',
  GENERATE_BOX: 'GENERATE_BOX',
  SET_CUR_DRAGGING: 'SET_CUR_DRAGGING',
  RESIZE_BOX: 'RESIZE_BOX',
  SET_CURSOR: 'SET_CURSOR',
  SET_TAB_VISIBILITY: 'SET_TAB_VISIBILITY',
};

export function setMouseClickPosition(uuid, xPos, yPos) {
  return { type: BoardActionTypes.SET_MOUSE_CLICK_POSITION, uuid, xPos, yPos };
}

export function setPosition(uuid, xPos, yPos) {
  return { type: BoardActionTypes.SET_POSITION, uuid, xPos, yPos };
}

export function setDragging(uuid, value) {
  return { type: BoardActionTypes.SET_DRAGGING, uuid, value };
}

export function setSize(uuid, w, h) {
  return { type: BoardActionTypes.SET_SIZE, uuid, w, h };
}

export function generateBox(uuid, color) {
  return { type: BoardActionTypes.GENERATE_BOX, uuid, color };
}

export function setCurDragging(uuid) {
  return { type: BoardActionTypes.SET_CUR_DRAGGING, uuid };
}

export function resizeBox(uuid, wVal, hVal) {
  return { type: BoardActionTypes.RESIZE_BOX, uuid, wVal, hVal };
}

export function setTabVisibility(uuid, visibility) {
  return { type: BoardActionTypes.SET_TAB_VISIBILITY, uuid, visibility}
}

export function setCursor(cursor) {
  return { type: BoardActionTypes.SET_CURSOR, cursor };
}
