import React from 'react';
import PropTypes from 'prop-types';

/**
 * A container component for draggable board elements.
 */
class Box extends React.Component {
  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp)
  }

  componentWillUnmount() {
    // Remove event listeners on box deletion/unmounting
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.mouseUp)
  }

  /**
    Gives the CSS styling for the given box.
    @return boxStyle - the JS object containing the correct styling for the box.
  */
  getBoxStyle = () => {
    const boxStyle = {
      backgroundColor: '#112233',
      left: `${this.props.x}px`,
      top: `${this.props.y}px`,
      width: '200px',
      height: '200px',
    };
    return boxStyle;
  };

  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseDown = (e) => {
    this.props.clickCallback(true);
    this.props.setMouseDown(this.props.uuid, -this.props.x + e.screenX, -this.props.y + e.screenY)
    console.log(e.screenY)
  }


  mouseMove = (e) => {
    console.log(this.props.y + " " + String(e.screenY-this.props.mouseY))
    if (this.props.dragging) {
      this.props.moveCallback(this.props.uuid, e.screenX-this.props.mouseX, e.screenY-this.props.mouseY);
    }
  };

  mouseUp = () => {
    this.props.clickCallback(this.props.uuid, false);
  }


  render() {
    return (
      // eslint-disable-next-line
      <div
        className="Box"
        onMouseDown={this.mouseDown}
        style={this.getBoxStyle()}
      />
    );
  }
}

Box.propTypes = {
  moveCallback: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
  clickCallback: PropTypes.func.isRequired,
  dragging: PropTypes.bool,
  setMouseDown: PropTypes.func.isRequired,
};

Box.defaultProps = {
  x: 0,
  y: 0,
  mouseX: 0,
  mouseY: 0,
  dragging: false,
}


export default Box;
