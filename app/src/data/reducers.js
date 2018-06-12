import { ActionTypes } from './actions';

function board(state = {}, action) {
  const curBoxes = Object.assign({}, state.boxes);
  switch (action.type) {
    case ActionTypes.SET_POSITION:
      curBoxes[action.uuid].x = action.xPos;
      curBoxes[action.uuid].y = action.yPos;
      return Object.assign(
        {},
        state,
        curBoxes,
      )
    case ActionTypes.SET_DRAGGING:
      curBoxes[action.uuid].dragging = action.value;
      return Object.assign(
        {},
        state,
        curBoxes,
      )
    case ActionTypes.SET_MOUSE_CLICK_POSITION:
      curBoxes[action.uuid].mouseX = action.xPos;
      curBoxes[action.uuid].mouseY = action.yPos;
      return Object.assign(
        {},
        state,
        curBoxes,
      )
    default:
      return state
  }
}

export default board;
