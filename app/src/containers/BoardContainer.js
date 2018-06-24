import { connect } from 'react-redux'
import { setPosition, setDragging, setMouseClickPosition, setCurDragging, resizeBox, setTabVisibility } from '../data/board-actions'
import { setCursor } from '../data/window-actions'
import Board from '../board/board'

// Maps the state to props
const mapStateToProps = state => ({
  boxOrder: state.boardReducer.boxOrder,
  boxes: state.boardReducer.boxes,
  curDragging: state.boardReducer.curDragging,
  cursor: state.boardWindowReducer.cursor,

  // Window state
  windowX: state.boardWindowReducer.windowX,
  windowY: state.boardWindowReducer.windowY,
});

// Defines callbacks to pass a props
const mapDispatchToProps = dispatch => ({
  moveCallback: (uuid, xPos, yPos) => {
    dispatch(setPosition(uuid, xPos, yPos))
  },
  clickCallback: (uuid, draggingState) => {
    dispatch(setDragging(uuid, draggingState))
  },
  setMouseDown: (uuid, xPos, yPos) => {
    dispatch(setMouseClickPosition(uuid, xPos, yPos))
  },
  setCurDragging: (uuid) => {
    dispatch(setCurDragging(uuid))
  },
  resizeCallback: (uuid, wVal, hVal) => {
    dispatch(resizeBox(uuid, wVal, hVal))
  },
  visibilityCallback: (uuid, visibility) => {
    dispatch(setTabVisibility(uuid, visibility))
  },
  cursorCallback: (cursor) => {
    dispatch(setCursor(cursor))
  }
});

const BoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardContainer;
