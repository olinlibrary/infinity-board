import { connect } from 'react-redux';
import BoardWindow from '../board/board-window'
import { setWindowDrag, setPrevWindowPosition, setCursor, setWindowPos } from '../data/window-actions'
import { generateBox } from '../data/board-actions'

const mapStateToProps = state => ({
  cursor: state.boardWindowReducer.cursor,
  windowDrag: state.boardWindowReducer.windowDrag,
  prevX: state.boardWindowReducer.prevX,
  prevY: state.boardWindowReducer.prevY,
  windowX: state.boardWindowReducer.windowX,
  windowY: state.boardWindowReducer.windowY,
});

const mapDispatchToProps = dispatch => ({
  setWindowDrag: (val) => {
    dispatch(setWindowDrag(val));
  },
  setPrevWindowPosition: (xVal, yVal) => {
    dispatch(setPrevWindowPosition(xVal, yVal));
  },
  setCursor: (cursor) => {
    dispatch(setCursor(cursor));
  },
  setWindowPos: (xVal, yVal) => {
    dispatch(setWindowPos(xVal, yVal));
  },

  // Board actions
  generateBox: (uuid, color) => {
    dispatch(generateBox(uuid, color))
  }
});

const BoardWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardWindow)

export default BoardWindowContainer;
