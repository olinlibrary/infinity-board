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
      cursor: this.props.cursor,
      backgroundColor: this.props.color,
      left: `${this.props.x}px`,
      top: `${this.props.y}px`,
      width: `${this.props.w}px`,
      height: `${this.props.h}px`,
      zIndex: this.props.zIndex, //TODO: Make this actually be an updated z-index
    };
    return boxStyle;
  };

  /**
    Returns the correct cursor given the state of the box.
    @return the css property name for the cursor
  */
  getCursor = (e) => {
    if (this.props.dragging === 'drag') {
      return 'move';
    } else if (this.props.dragging === 'resize' || this.cursorInDraggingPosition(e)) {
      return 'se-resize';
    }
    return 'default';
  };
  
  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseDown = (e) => {
    if (e.button === 0) {
      this.props.setCurDragging(this.props.uuid);
      if (this.cursorInDraggingPosition(e)) {
        console.log('resize')
        this.props.clickCallback(this.props.uuid, 'resize')
      } else {
        this.props.clickCallback(this.props.uuid, 'drag')
      }
      // Defines the position of the mouse click relative to the top left corner of the box
      this.props.setMouseDown(this.props.uuid, -this.props.x + e.clientX, -this.props.y + e.clientY)
    }
  }

  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseMove = (e) => {
    // Change the cursor based on what is currently happening
    this.props.cursorCallback(this.getCursor(e))

    if (this.props.dragging === 'drag') {
      this.props.moveCallback(
        this.props.uuid, e.clientX - this.props.mouseX,
        e.clientY - this.props.mouseY
      );
    } else if (this.props.dragging === 'resize') {
      this.props.cursorCallback('move');
      // Resize the current box
      this.props.resizeCallback(
        this.props.uuid,
        e.clientX - this.props.x - 40,
        e.clientY - this.props.y - 40
      );
    }
  }

  mouseUp = () => {
    this.props.setCurDragging('')
    this.props.clickCallback(this.props.uuid, '');
  };

  /**
  Determines whether the mouse is in dragging position.
  @return a bool indicating whether the mouse is in dragging position
  */
  cursorInDraggingPosition = (e) => {
    const cornerX = (e.clientX - this.props.x - this.props.w - 40) ** 2;
    const cornerY = (e.clientY - this.props.y - this.props.h - 40) ** 2;
    const dist = Math.sqrt(cornerX + cornerY);
    return (dist < 20);
  };

  render() {
    console.log(this.props.tabVisibility)
    return (
      // eslint-disable-next-line
      <div>
        <div
          className="Box"
          onMouseDown={this.mouseDown}
          style={this.getBoxStyle()}
          onMouseEnter={() => { this.props.visibilityCallback(this.props.uuid, 1) }}
          onMouseLeave={() => { this.props.visibilityCallback(this.props.uuid, 0) }}
        >
          <div className="pull-tab"
            style={{
            zIndex: this.props.zIndex + 2,
            opacity: this.props.tabVisibility }} />
        </div>
      </div>
    );
  }
}

Box.propTypes = {
  // Callbacks
  moveCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func.isRequired,
  setMouseDown: PropTypes.func.isRequired,
  setCurDragging: PropTypes.func.isRequired,
  resizeCallback: PropTypes.func.isRequired,
  cursorCallback: PropTypes.func.isRequired,

  // Box attributes
  color: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,

  // Box state
  x: PropTypes.number,
  y: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
  dragging: PropTypes.string,
  zIndex: PropTypes.number,
  cursor: PropTypes.string.isRequired,
  tabVisibility: PropTypes.number,
};

Box.defaultProps = {
  x: 0,
  y: 0,
  w: 200,
  h: 200,
  mouseX: 0,
  mouseY: 0,
  dragging: '',
  zIndex: 1,
  tabVisibility: 0,
}


export default Box;
