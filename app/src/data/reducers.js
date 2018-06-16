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
        { boxes: curBoxes },
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
        { boxes: curBoxes },
      )
    case ActionTypes.GENERATE_BOX:
      curBoxes[action.uuid] = {
        x: 200,
        y: 200,
        mouseX: 0,
        mouseY: 0,
        dragging: '',
        color: action.color,
      }
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case ActionTypes.SET_CUR_DRAGGING:
      const newBoxOrder = state.boxOrder;
      newBoxOrder.unshift(action.uuid); // Move new box to the front
      return Object.assign(
        {},
        state,
        { curDragging: action.uuid, boxOrder: newBoxOrder },
      )
    case ActionTypes.RESIZE_BOX:
      curBoxes[action.uuid].w = action.wVal;
      curBoxes[action.uuid].h = action.hVal;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    default:
      return state
    case ActionTypes.SET_CURSOR:
      return Object.assign(
        {},
        state,
        { cursor: action.cursor }
      )
    case ActionTypes.SET_TAB_VISIBILITY:
      curBoxes[action.uuid].tabVisibility = action.visibility;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
  }
}

export default board;
