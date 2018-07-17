import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import ServerComm from '.././server-comm';
import Box from './box'
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {
  constructor(props) {
    super(props);

    this.props.comm.setReceivedBoardDataMessageHandler(this.receivedBoardData);
  }

  componentDidMount() {
    // console.log(this.props.boardName);
    // Retrieve board data
    this.props.comm.getBoardData(null, this.props.boardName)
  }

  // Avoids unnecessary calls to setCurDragging, which improves performance
  setDragging = (uuid) => {
    if (uuid !== this.props.curDragging) {
      this.props.setCurDragging(uuid);
    }
  }

  /**
   * Called when the initial board data is loaded.
   * @param board - the board object.
  */
  receivedBoardData = (board) => {
    // console.log("BoardID")
    // console.log(board._id)
    this.props.setBoardName(board._id);
    this.props.updateStore(board.store);
  };

  /**
   * Called on ImageBox load to resize image correctly
   * @param uuid: the UUID of the box
   * @param w: the new width of the box
   * @param h: the new height of the box
  */
  updateImage = (uuid, w, h) => {
    let wVal = 0;
    let hVal = 0;
    const aspect = w / h;

    // Update based on the minimum size, and the aspect ratio of the image
    if (w < h) {
      wVal = Math.min(200, Math.max(500, w));
      hVal = wVal / aspect;
    } else {
      hVal = Math.min(200, Math.max(500, h));
      wVal = hVal * aspect;
    }

    this.props.resizeCallback(uuid, wVal, hVal);
  };


  render() {
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
      boxProps.setFrontBox = this.props.setFrontBox;

      if (boxProps.type === 'text') {
        boxProps.editCallback = this.props.updateText;
        boxProps.setEditing = this.props.setEditing;
        boxProps.mouseMove = this.props.mouseMove;
        boxes.push(<TextBox {...boxProps} />);
      } else if (boxProps.type === 'image') {
        boxProps.setImgAspect = this.props.setImgAspect;
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
  boardName: PropTypes.string,

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
  boardName: '',
}

export default Board;
