import { connect } from 'react-redux';
import BoardWindow from '../board/board-window';
import {
  setWindowDrag,
  setPrevWindowPosition,
  setCursor,
  setWindowPos,
  setOverDelete,
  setMouseMove,
} from '../data/window-actions';
import { generateBox } from '../data/board-actions';

const mapStateToProps = state => ({
  cursor: state.boardWindowReducer.cursor,
  windowDrag: state.boardWindowReducer.windowDrag,
  prevX: state.boardWindowReducer.prevX,
  prevY: state.boardWindowReducer.prevY,
  windowX: state.boardWindowReducer.windowX,
  windowY: state.boardWindowReducer.windowY,
  overDelete: state.boardWindowReducer.overDelete,
  clients: state.boardWindowReducer.clients,
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
  setWindowPos: (xVal, yVal, innerWidth, innerHeight) => {
    dispatch(setWindowPos(xVal, yVal, innerWidth, innerHeight));
  },
  setOverDelete: (val) => {
    dispatch(setOverDelete(val));
  },
  setMouseMove: (val) => {
    dispatch(setMouseMove(val));
  },
  // Board actions
  generateBox: (uuid, color, boxType, optionalArgs) => {
    dispatch(generateBox(uuid, color, boxType, optionalArgs));
  },
});

const BoardWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardWindow)

export default BoardWindowContainer;
