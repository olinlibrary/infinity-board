import React from 'react';
import PropTypes from 'prop-types';

/**
 * A container component for draggable board elements.
 */
class Box extends React.Component {
  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove);
  }

  componentWillUnmount() {
    // Remove event listeners on box deletion/unmounting
    document.removeEventListener('mousemove', this.mouseMove);
  }

  /**
    Gives the CSS styling for the given box.
    @return boxStyle - the JS object containing the correct styling for the box.
  */
  getBoxStyle = () => {
    const boxStyle = {
      backgroundColor: '#112233',
      left: `${this.props.x}px`,
      top: `${this.props.x}px`,
      width: '200px',
      height: '200px',
    };
    return boxStyle;
  };

  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseMove = (e) => {
    this.props.moveCallback(e.clientX, e.clientY);
  };


  render() {
    return (
      // eslint-disable-next-line
      <div
        className="Box"
        style={this.getBoxStyle()}
      />
    );
  }
}

Box.propTypes = {
  moveCallback: PropTypes.func.isRequired,
};


export default Box;
