import { connect } from 'react-redux';
import BoardWindow from '../board/board-window'
import { setWindowDrag, setPrevWindowPosition, setCursor } from '../data/actions'

const mapStateToProps = state => ({
  cursor: state.boardReducer.cursor,
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
  }
});

const BoardWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardWindow)

export default BoardWindowContainer;
