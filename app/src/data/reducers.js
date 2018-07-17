import { combineReducers } from 'redux';
import { BoardActionTypes } from './board-actions';
import { WindowActionTypes } from './window-actions';

function boardWindowReducer(state = {}, action) {
  switch (action.type) {
    case WindowActionTypes.SET_CURSOR:
      return Object.assign(
        {},
        state,
        { cursor: action.cursor },
      );
    case WindowActionTypes.SET_WINDOW_DRAG:
      return Object.assign(
        {},
        state,
        { windowDrag: action.val },
      )
    case WindowActionTypes.SET_PREV_WINDOW_POSITION:
      return Object.assign(
        {},
        state,
        { prevX: action.xVal, prevY: action.yVal },
      )
    case WindowActionTypes.SET_WINDOW_POS:
      return Object.assign(
        {},
        state,
        { windowX: action.xVal, windowY: action.yVal },
      )
    case WindowActionTypes.SET_OVER_DELETE:
      return Object.assign(
        {},
        state,
        { overDelete: action.val },
      )
    case WindowActionTypes.SET_MOUSE_MOVE:
      return Object.assign(
        {},
        state,
        { mouseMove: action.val },
      )
    default:
      return state;
  }
}

function boardReducer(state = {}, action) {
  const curBoxes = Object.assign({}, state.boxes);
  let newBoxOrder = state.boxOrder;
  const first = action.uuid;
  switch (action.type) {
    case BoardActionTypes.SET_POSITION:
      curBoxes[action.uuid].x = action.xPos;
      curBoxes[action.uuid].y = action.yPos;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_DRAGGING:
      curBoxes[action.uuid].dragging = action.value;
      return Object.assign(
        {},
        state,
        curBoxes,
      )
    case BoardActionTypes.SET_MOUSE_CLICK_POSITION:
      curBoxes[action.uuid].mouseX = action.xPos;
      curBoxes[action.uuid].mouseY = action.yPos;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.GENERATE_BOX:
      newBoxOrder.push(action.uuid); // Move new box to the front
      curBoxes[action.uuid] = {
        x: 200,
        y: 200,
        mouseX: 0,
        mouseY: 0,
        dragging: '',
        color: action.color,
        type: action.boxType,
        ...action.optionalArgs
      }
      return Object.assign(
        {},
        state,
        { boxes: curBoxes, boxOrder: newBoxOrder },
      )
    case BoardActionTypes.SET_CUR_DRAGGING:
      return Object.assign(
        {},
        state,
        { curDragging: action.uuid },
      )
    case BoardActionTypes.RESIZE_BOX:
      curBoxes[action.uuid].w = action.wVal;
      curBoxes[action.uuid].h = action.hVal;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_TAB_VISIBILITY:
      curBoxes[action.uuid].tabVisibility = action.visibility;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.DELETE_BOX:
      delete curBoxes[action.uuid];
      newBoxOrder.splice(-1, 1);
      return Object.assign(
        {},
        state,
        { boxes: curBoxes, boxOrder: newBoxOrder },
      )
    case BoardActionTypes.UPDATE_TEXT:
      curBoxes[action.uuid].text = action.text;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_EDITING:
      curBoxes[action.uuid].editing = action.val;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_IMG_LOADED:
      curBoxes[action.uuid].isLoaded = action.val;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_IMG_ASPECT:
      curBoxes[action.uuid].aspect = action.w / action.h;
      return Object.assign(
        {},
        state,
        { boxes: curBoxes },
      )
    case BoardActionTypes.SET_FRONT_BOX:
      newBoxOrder.push(newBoxOrder.splice(newBoxOrder.indexOf(first), 1)[0]);
      return Object.assign(
        {},
        state,
        { boxOrder: newBoxOrder },
      )
    case BoardActionTypes.UPDATE_STORE:
      console.log(action.store)
      return Object.assign(
        {},
        state,
        action.store,
      )
    default:
      return state
  }
}

const defaultReducer = combineReducers({ boardReducer, boardWindowReducer });

export default defaultReducer;
