
export const BoardActionTypes = {
  SET_MOUSE_CLICK_POSITION: 'SET_MOUSE_CLICK_POSITION',
  SET_DRAGGING: 'SET_DRAGGING',
  SET_POSITION: 'SET_POSITION',
  GENERATE_BOX: 'GENERATE_BOX',
  SET_CUR_DRAGGING: 'SET_CUR_DRAGGING',
  RESIZE_BOX: 'RESIZE_BOX',
  SET_CURSOR: 'SET_CURSOR',
  SET_TAB_VISIBILITY: 'SET_TAB_VISIBILITY',
  DELETE_BOX: 'DELETE_BOX',
  UPDATE_TEXT: 'UPDATE_TEXT',
  SET_EDITING: 'SET_EDITING',
  SET_IMG_LOADED: 'SET_IMG_LOADED',
  SET_FRONT_BOX: 'SET_FRONT_BOX',
};

export const SharedActionTypes = {
  SET_DRAGGING: 'SET_DRAGGING',
  SET_POSITION: 'SET_POSITION',
  GENERATE_BOX: 'GENERATE_BOX',
  RESIZE_BOX: 'RESIZE_BOX',
  DELETE_BOX: 'DELETE_BOX',
  UPDATE_TEXT: 'UPDATE_TEXT',
  SET_EDITING: 'SET_EDITING',
  SET_IMG_LOADED: 'SET_IMG_LOADED',
  SET_FRONT_BOX: 'SET_FRONT_BOX',
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

export function generateBox(uuid, color, boxType, optionalArgs) {
  return { type: BoardActionTypes.GENERATE_BOX, uuid, color, boxType, optionalArgs };
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

export function deleteBox(uuid) {
  return { type: BoardActionTypes.DELETE_BOX, uuid };
}

export function updateText(uuid, text) {
  return { type: BoardActionTypes.UPDATE_TEXT, uuid, text };
}

export function setEditing(uuid, val) {
  return { type: BoardActionTypes.SET_EDITING, uuid, val };
}

export function setImgLoaded(uuid, val) {
  return { type: BoardActionTypes.SET_IMG_LOADED, uuid, val };
}

export function setFrontBox(uuid) {
  return { type: BoardActionTypes.SET_FRONT_BOX, uuid };
}
