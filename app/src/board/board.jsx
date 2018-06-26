import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import ServerComm from '.././server-comm';
import Box from './box'
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {


  // Avoids unnecessary calls to setCurDragging, which improves performance
  setDragging = (uuid) => {
    if (uuid !== this.props.curDragging) {
      this.props.setCurDragging(uuid)
    }
  }

  /**
   * Called on ImageBox load to resize image correctly
   * @param uuid: the UUID of the box
   * @param w: the new width of the box
   * @param h: the new height of the box
  */
  updateImage = (uuid, w, h, isUpload) => {
    let wVal = 0;
    let hVal = 0;
    const aspect = w / h;
    const initState = this.props.boxes;
    initState[uuid].aspect = w / h; // Track the aspect ratio
    if (isUpload) { // If it's a newly uploaded picture, update the size
      if (w > 500) { // Bound the initial render size to 500x500 to avoid huge images
        wVal = 500;
        hVal = wVal / aspect;
      } else if (h > 500) {
        hVal = 500;
        wVal = hVal * aspect;
      } else {
        hVal = h; // Otherwise, set based on aspect ratio
        wVal = hVal * aspect;
      }
      // this.updateBoardState(uuid, {
      //   w: wVal,
      //   h: hVal,
      // }); // Update the size on other clients
      this.props.resizeCallback(uuid, wVal, hVal);
    }
  };


  render() {
    // console.log(this.props.boxes)
    // console.log(this.props.boxes)
    const allKeys = this.props.boxOrder;
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const curKey = allKeys[i];
      const boxProps = Object.assign({}, this.props.boxes[curKey]);

      // Update the box state with the window position
      boxProps.renderX = boxProps.x + this.props.windowX;
      boxProps.renderY = boxProps.y + this.props.windowY;
      boxProps.key = curKey;
      boxProps.uuid = curKey;
      boxProps.cursor = this.props.cursor;
      boxProps.overDelete = this.props.overDelete;
      boxProps.setMouseDown = this.props.setMouseDown;
      boxProps.moveCallback = this.props.moveCallback;
      boxProps.clickCallback = this.props.clickCallback;
      boxProps.setCurDragging = this.setDragging;
      boxProps.resizeCallback = this.props.resizeCallback;
      boxProps.cursorCallback = this.props.cursorCallback;
      boxProps.visibilityCallback = this.props.visibilityCallback;
      boxProps.deleteBox = this.props.deleteBox;

      if (boxProps.type === 'text') {
        boxProps.editCallback = this.props.updateText;
        boxProps.setEditing = this.props.setEditing;
        boxProps.mouseMove = this.props.mouseMove;
        boxes.push(<TextBox {...boxProps} />);
      } else if (boxProps.type === 'image') {
        boxProps.imgCallback = this.updateImage;
        boxProps.setImgLoaded = this.props.setImgLoaded;
        boxes.push(<ImageBox {...boxProps} />);
      }
    }
    // console.log(boxes)
    // const buttonStyle = { zIndex: this.state.zIndex + 2 };
    return (
      // eslint-disable-next-line
      <div>
        {boxes}
      </div>
    );
  }
}

Board.propTypes = {
  // eslint-disable-next-line
  boxes: PropTypes.object,
  cursor: PropTypes.string,
  setMouseDown: PropTypes.func.isRequired,
  moveCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func.isRequired,
  cursorCallback: PropTypes.func.isRequired,
  visibilityCallback: PropTypes.func.isRequired,
  setCurDragging: PropTypes.func.isRequired,
  resizeCallback: PropTypes.func.isRequired,
  // eslint-disable-next-line
  boxOrder: PropTypes.array.isRequired,
  windowX: PropTypes.number,
  windowY: PropTypes.number,
  overDelete: PropTypes.bool,
};

Board.defaultProps = {
  overDelete: false,
  cursor: 'move',
  boxes: {},
  windowX: 0,
  windowY: 0,
}

export default Board;
