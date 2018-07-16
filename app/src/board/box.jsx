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
      Handles the resizing of the given box.
      @param mouseVal: the position value (x or y) for the mouse
      @param elemVal: the position value for the element
      @param min: the minimum width or height of the box
      @return the resulting width or height value
    */
    getResize = (mouseVal, elemVal, min) => {
      const newSize = mouseVal - elemVal;
      if (newSize >= min) {
        return newSize;
      }
      return min;
    };
  /**
    Gives the CSS styling for the given box.
    @return boxStyle - the JS object containing the correct styling for the box.
  */
  getBoxStyle = () => {
    const boxStyle = {
      cursor: this.props.cursor,
      backgroundColor: this.props.color,
      left: `${this.props.renderX}px`,
      top: `${this.props.renderY}px`,
      width: `${this.props.w - (2 * this.props.padding)}px`,
      height: `${this.props.h - (2 * this.props.padding)}px`,
      zIndex: 1,
      padding: this.props.padding
    };
    return boxStyle;
  };

  /**
    Returns the correct cursor given the state of the box.
    @return the css property name for the cursor
  */
  getCursor = (e) => {
    if (this.props.dragging === 'drag') {
      console.log("move")
      return 'move';
    } else if (this.props.dragging === 'resize' || this.cursorInDraggingPosition(e)) {
      console.log("resize")
      return 'se-resize';
    }
    console.log("default")
    return 'default';
  };

  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button === 0) {
      this.props.setCurDragging(this.props.uuid);
      // Callback for pushing box to front (also sent via websocket)
      this.props.setFrontBox(this.props.uuid);
      if (this.cursorInDraggingPosition(e)) {
        this.props.clickCallback(this.props.uuid, 'resize')
      } else {
        this.props.clickCallback(this.props.uuid, 'drag')
      }
      // Defines the position of the mouse click relative to the top left corner of the box
      this.props.setMouseDown(this.props.uuid, this.props.x - e.screenX, this.props.y - e.screenY)
      // this.props.cursorCallback(this.getCursor(e));
    }
  }

  /**
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseMove = (e) => {
    // If the mouse is currently over the box, change the cursor
    if (this.props.tabVisibility === 1) {
      this.props.cursorCallback(this.getCursor(e))
    }

    // If dragging is happening, then move the box
    if (this.props.dragging === 'drag') {
      this.props.moveCallback(
        this.props.uuid,
        e.screenX + this.props.mouseX,
        e.screenY + this.props.mouseY
      );
    } else if (this.props.dragging === 'resize') {
      // Resize the current box
      this.props.resizeCallback(
        this.props.uuid,
        this.getResize(e.clientX, this.props.renderX, this.props.minWidth),
        this.getResize(e.clientY, this.props.renderY, this.props.minHeight),
      );
    }
  }

  /*
    Handles actions that occur on mouseUp events
  */
  mouseUp = (e) => {

    // Check to ensure this event is firing on the correct box
    if (this.props.dragging !== '') {
      this.props.setCurDragging('')
      this.props.clickCallback(this.props.uuid, '');
      if (this.props.overDelete) {
        this.props.deleteBox(this.props.uuid)
      }
    }

  };

  /**
  Determines whether the mouse is in dragging position.
  @return a bool indicating whether the mouse is in dragging position
  */
  cursorInDraggingPosition = (e) => {
    const cornerX = (e.clientX - this.props.renderX - this.props.w) ** 2;
    const cornerY = (e.clientY - this.props.renderY - this.props.h) ** 2;
    const dist = Math.sqrt(cornerX + cornerY);
    return (dist < 20);
  };

  render() {
    const boxOpacity = (this.props.overDelete && this.props.dragging !== '') ? 0.5 : 1;
    return (
      // eslint-disable-next-line
      <div style={{ opacity: boxOpacity }}>
        <div
          className="Box"
          onMouseDown={this.mouseDown}
          style={this.getBoxStyle()}
          onMouseEnter={() => { this.props.visibilityCallback(this.props.uuid, 1) }}
          onMouseLeave={() => { this.props.visibilityCallback(this.props.uuid, 0) }}
        >
          {this.props.children}
          <div className="pull-tab"
            style={{
            zIndex: 2,
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
  deleteBox: PropTypes.func.isRequired,
  setFrontBox: PropTypes.func.isRequired,

  // Box attributes
  color: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  padding: PropTypes.number,

  // Box state
  x: PropTypes.number,
  y: PropTypes.number,
  renderX: PropTypes.number,
  renderY: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
  dragging: PropTypes.string,
  cursor: PropTypes.string.isRequired,
  tabVisibility: PropTypes.number,
  padding: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  overDelete: PropTypes.bool,
};

Box.defaultProps = {
  x: 0,
  y: 0,
  renderX: 0,
  renderY: 0,
  w: 200,
  h: 200,
  mouseX: 0,
  mouseY: 0,
  dragging: '',
  tabVisibility: 0,
  padding: 20,
  minWidth: 200,
  minHeight: 200,
  overDelete: false,
  padding: 20,
}


export default Box;
