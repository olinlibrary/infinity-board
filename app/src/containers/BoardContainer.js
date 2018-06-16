import { connect } from 'react-redux'
import { setPosition, setDragging, setMouseClickPosition, generateBox, setCurDragging, resizeBox, setCursor, setTabVisibility } from '../data/actions'
import Board from '../board/board'

// Maps the state to props
const mapStateToProps = state => ({
  boxes: state.boxes,
  curDragging: state.curDragging,
  cursor: state.cursor,
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
  generateBox: (uuid, color) => {
    dispatch(generateBox(uuid, color))
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

const BoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoxContainer;