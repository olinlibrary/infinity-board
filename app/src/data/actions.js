
export const ActionTypes = {
  SET_POSITION: 'SET_POSITION',
  SET_SIZE: 'SET_SIZE',
};


export function setPosition(xPos, yPos) {
  return { type: ActionTypes.SET_POSITION, xPos, yPos };
}

export function setSize(w, h) {
  return { type: ActionTypes.SET_SIZE, w, h };
}
