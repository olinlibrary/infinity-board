import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {
  constructor(props) {
    super(props);

    this.props.comm.setReceivedBoardDataMessageHandler(this.receivedBoardData);
  }

  componentDidMount() {
    // Retrieve board data
    this.props.comm.getBoardData(null, this.props.boardName);
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
    // eslint-disable-next-line
    this.props.setBoardName(board._id);
    this.props.updateStore(board.store);
  };

  /**
   * Called on ImageBox load to resize image correctly
   * @param uuid: the UUID of the box
   * @param w: the width of the image
   * @param h: the height of the image
  */
  updateImage = (uuid, w, h) => {
    let wVal = 0;
    let hVal = 0;
    const aspect = w / h;

    // Update based on the minimum size, and the aspect ratio of the image
    if (w < h) {
      // Clip driving value to a reasonable size range
      wVal = Math.max(200, Math.min(500, w));
      hVal = wVal / aspect;
    } else {
      hVal = Math.max(200, Math.min(500, h));
      wVal = hVal * aspect;
    }

    // Resize the box
    this.props.resizeCallback(uuid, wVal, hVal);
  };


  render() {
    const allKeys = this.props.boxOrder;
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const curKey = allKeys[i];
      const boxProps = Object.assign({}, this.props.boxes[curKey]);

      // Update the box state with board state, properties, and callbacks
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

      // Callbacks specific to certain box types
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
    return (
      // eslint-disable-next-line
      <div>
        {boxes}
      </div>
    );
  }
}

Board.propTypes = {
  // callbacks
  updateText: PropTypes.func.isRequired,
  setEditing: PropTypes.func.isRequired,
  mouseMove: PropTypes.func.isRequired,
  setImgAspect: PropTypes.func.isRequired,
  setImgLoaded: PropTypes.func.isRequired,
  setBoardName: PropTypes.func.isRequired,
  updateStore: PropTypes.func.isRequired,
  setMouseDown: PropTypes.func.isRequired,
  moveCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func.isRequired,
  cursorCallback: PropTypes.func.isRequired,
  visibilityCallback: PropTypes.func.isRequired,
  setCurDragging: PropTypes.func.isRequired,
  resizeCallback: PropTypes.func.isRequired,
  deleteBox: PropTypes.func.isRequired,
  setFrontBox: PropTypes.func.isRequired,

  // Board properties
  // eslint-disable-next-line
  comm: Proptyes.object.isRequired,
  boardName: PropTypes.string,

  // Board state
  // eslint-disable-next-line
  boxes: PropTypes.object,
  cursor: PropTypes.string,
  // eslint-disable-next-line
  boxOrder: PropTypes.array.isRequired,
  windowX: PropTypes.number,
  windowY: PropTypes.number,
  overDelete: PropTypes.bool,
  curDragging: PropTypes.string,
};

Board.defaultProps = {
  overDelete: false,
  cursor: 'move',
  boxes: {},
  windowX: 0,
  windowY: 0,
  boardName: '',
  curDragging: '',
}

export default Board;
