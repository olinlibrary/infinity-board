import { ActionTypes } from './actions';

function box(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_POSITION:
      return Object.assign(
        {},
        state,
        { x: action.xPos, y: action.yPos },
      )
    case ActionTypes.SET_DRAGGING:
      return Object.assign(
        {},
        state,
        { dragging: action.value },
      )
    case ActionTypes.SET_MOUSE_CLICK_POSITION:
      return Object.assign(
        {},
        state,
        { mouseX: action.xPos, mouseY: action.yPos },
      )
    default:
      return state
  }
}

export default box;
