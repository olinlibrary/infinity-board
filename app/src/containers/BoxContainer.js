import { connect } from 'react-redux'
import { setPosition } from '../data/actions'
import DraggableBox from '../board/draggable-box'

// Maps the state to props
const mapStateToProps = state => ({
  x: state.x,
  y: state.y,
});

// Defines callbacks to pass a props
const mapDispatchToProps = dispatch => ({
  callback: dispatch(() => {}),
  deleteCallback: dispatch(() => {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableBox)
