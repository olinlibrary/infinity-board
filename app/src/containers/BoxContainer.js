import { connect } from 'react-redux'
import { setPosition } from '../data/actions'
import Box from '../board/box'

// Maps the state to props
const mapStateToProps = state => ({
  x: state.x,
  y: state.y,
});

// Defines callbacks to pass a props
const mapDispatchToProps = dispatch => ({
  moveCallback: (xPos, yPos) => {
    dispatch(setPosition(xPos, yPos))
  }
});

const BoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Box)

export default BoxContainer;
