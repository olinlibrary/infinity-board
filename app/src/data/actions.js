
export const ActionTypes = {
  SET_MOUSE_CLICK_POSITION: 'SET_MOUSE_CLICK_POSITION',
  SET_DRAGGING: 'SET_DRAGGING',
  SET_POSITION: 'SET_POSITION',
  SET_SIZE: 'SET_SIZE',
};

export function setMouseClickPosition(xPos, yPos) {
  return { type: ActionTypes.SET_MOUSE_CLICK_POSITION, xPos, yPos };
}

export function setPosition(xPos, yPos) {
  return { type: ActionTypes.SET_POSITION, xPos, yPos };
}

export function setDragging(value) {
  return { type: ActionTypes.SET_DRAGGING, value };
}

export function setSize(w, h) {
  return { type: ActionTypes.SET_SIZE, w, h };
}
