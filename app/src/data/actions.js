
export const ActionTypes = {
  SET_MOUSE_CLICK_POSITION: 'SET_MOUSE_CLICK_POSITION',
  SET_DRAGGING: 'SET_DRAGGING',
  SET_POSITION: 'SET_POSITION',
  SET_SIZE: 'SET_SIZE',
  GENERATE_BOX: 'GENERATE_BOX',
  SET_CUR_DRAGGING: 'SET_CUR_DRAGGING',
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
