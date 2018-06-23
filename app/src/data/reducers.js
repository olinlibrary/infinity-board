import { combineReducers } from 'redux';
import { ActionTypes } from './actions';

function boardWindowReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function boardReducer(state = {}, action) {
  const curBoxes = Object.assign({}, state.boxes);
  const newBoxOrder = state.boxOrder;
  const first = action.uuid;
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
      newBoxOrder.push(action.uuid); // Move new box to the front
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
        { boxes: curBoxes, boxOrder: newBoxOrder },
      )
    case ActionTypes.SET_CUR_DRAGGING:
      newBoxOrder.push(newBoxOrder.splice(newBoxOrder.indexOf(first), 1)[0]);
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
    case ActionTypes.SET_TAB_VISIBILITY:
      curBoxes[action.uuid].tabVisibility = action.visibility;
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
  }
}

const defaultReducer = combineReducers({ boardReducer, boardWindowReducer });

export default defaultReducer;
