import React from 'react';
import PropTypes from 'prop-types';
import ReactS3Uploader from 'react-s3-uploader';
import BoardContainer from '../containers/BoardContainer';

class BoardWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  /**
   * Updates the board state to allow window movement on mouse press.
  */
  mouseDown = (e) => {
    // Only drag on middle mouse, or when not over a box
    if (e.button === 1 || e.target === this.view) {
      this.props.setWindowDrag(true);
      this.props.setPrevWindowPosition(e.clientX, e.clientY);
      this.props.setCursor('move');
    }
  };

  /**
   * Stops movement of the board window.
  */
  // mouseUp = () => {
  //   this.setState({ dragging: false, cursor: 'default' });
  // };

  getBGStyle = () => {
    return { // Set the position for the grid background
      // eslint-disable-next-line
      // backgroundPosition: String(this.state.windowX % 50) + 'px ' +  String(this.state.windowY % 50) + 'px',
    };
  }

  render() {
    return (
      // eslint-disable-next-line
      <div className="View"
        onMouseMove={this.dragWindow}
        onMouseUp={this.mouseUp}
        style={{ cursor: this.props.cursor }}
      >
        <div>
          {this.props.children}
        </div>
        <div className="View" style={this.getBGStyle()} id="bg" ref={(view) => { this.view = view; }} />
        <div className="Button-wrapper">
          <div className="Box-button">
            <button className="Box-button" onClick={this.generateBox}>
              <i className="fa fa-home" />
            </button>
          </div>
        </div>

      </div>
    )
  }
}

BoardWindow.propTypes = {
  // eslint-disable-next-line
  setWindowDrag: PropTypes.func.isRequired,
  setPrevWindowPosition: PropTypes.func.isRequired,
  setCursor: PropTypes.func.isRequired,
};

BoardWindow.defaultProps = {
}


export default BoardWindow;
