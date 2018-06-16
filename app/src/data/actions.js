
export const ActionTypes = {
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
  return { type: ActionTypes.SET_MOUSE_CLICK_POSITION, uuid, xPos, yPos };
}

export function setPosition(uuid, xPos, yPos) {
  return { type: ActionTypes.SET_POSITION, uuid, xPos, yPos };
}

export function setDragging(uuid, value) {
  return { type: ActionTypes.SET_DRAGGING, uuid, value };
}

export function setSize(uuid, w, h) {
  return { type: ActionTypes.SET_SIZE, uuid, w, h };
}

export function generateBox(uuid, color) {
  return { type: ActionTypes.GENERATE_BOX, uuid, color };
}

export function setCurDragging(uuid) {
  return { type: ActionTypes.SET_CUR_DRAGGING, uuid };
}

export function resizeBox(uuid, wVal, hVal) {
  return { type: ActionTypes.RESIZE_BOX, uuid, wVal, hVal };
}

export function setTabVisibility(uuid, visibility) {
  return { type: ActionTypes.SET_TAB_VISIBILITY, uuid, visibility}
}

export function setCursor(cursor) {
  return { type: ActionTypes.SET_CURSOR, cursor };
}
