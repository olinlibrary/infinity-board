import { connect } from 'react-redux'
import { setPosition, setDragging, setMouseClickPosition } from '../data/actions'
import Box from '../board/box'

// Maps the state to props
const mapStateToProps = state => ({
  x: state.x,
  y: state.y,
  mouseX: state.mouseX,
  mouseY: state.mouseY,
  dragging: state.dragging,
});

// Defines callbacks to pass a props
const mapDispatchToProps = dispatch => ({
  moveCallback: (xPos, yPos) => {
    dispatch(setPosition(xPos, yPos))
  },
  clickCallback: (draggingState) => {
    dispatch(setDragging(draggingState))
  },
  setMouseDown: (xPos, yPos) => {
    dispatch(setMouseClickPosition(xPos, yPos))
  }
});

const BoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Box)

export default BoxContainer;
