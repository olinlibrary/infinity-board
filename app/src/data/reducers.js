import { ActionTypes } from './actions';

function board(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_POSITION:
      return Object.assign(
        {},
        state,
        { x: action.xPos, y: action.yPos },
      )
    default:
      return state
  }
}

export default board;
