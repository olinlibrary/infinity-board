import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import ReactS3Uploader from 'react-s3-uploader';
import uuidv4 from 'uuid/v4';
import '../App.css';
import ServerComm from '.././server-comm';
import TextBox from './text-box';
import ImageBox from './image-box';
import FileDragger from './file-dragger';

/**
 * The component responsible for drawing all elements of the board.
 */
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.io = new ServerComm(window.SERVER_URI);
    this.io.setReceivedUpdateMessageHandler(this.onUpdate);
    this.io.connect();
    this.state = {
      clientUUID: uuidv4(),
      clientColor: randomColor(),
      windowX: 0,
      windowY: 0,
      prevX: 0,
      prevY: 0,
      zIndex: 1,
      boxes: props.data.elements,
      curDragging: '',
      onDelete: false,
      otherUsers: {},
    };
  }

  /**
   * Called once the component has rendered on the screen.
   */
  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousedown', this.mouseDown);
  }


  /**
   * On finishing upload of an image, create a box containing that image
   * @param e - the upload finish event
  */
  onUploadFinish = (e) => {
    // eslint-disable-next-line
    const imgUrl = window.SERVER_URI + e.publicUrl;
    this.generateBox('image', imgUrl, true);
  };

  /**
   * Update the state for a given board based on a message from the WebSocket.
   * @param msg - the WebSocket message containing updated state data for the board.
  */
  onUpdate = (msg) => {
    const updatedState = Object.assign({}, this.state.boxes, {
      [msg.uuid]: Object.assign({}, this.state.boxes[msg.uuid], {
        state: msg.state,
        type: msg.type,
      }),
    }); // TODO: Seems redundant from updateBoardState, should change
    this.setState({
      boxes: updatedState,
      zIndex: msg.zIndex,
      otherUsers: msg.clients,
    });
  };


  inputFile = () => {
  }

  handleDelete = (uuid) => {
    if (uuid === this.state.curDragging) { // Check to see that we're deleting the correct box
      const allBoxes = Object.assign({}, this.state.boxes);
      delete allBoxes[uuid];
      this.setState({ boxes: allBoxes, curDragging: '' })
    }
  }

  /**
  * Update the state for a given board based on a mouse event.
  * @param {string} uuidVal - the UUID of the board.
  * @param newState: The state object containing the updated state elements of the given box.
  */
  updateBoardState = (uuidVal, newState) => {
    const origState = Object.assign({}, this.state.boxes);
    const updatedState = Object.assign( // Update just the state elements we care about
      {},
      origState[uuidVal].state,
      newState,
    ); // Doing this is necessary to index by UUID

    if (newState.curDragging !== undefined) {
      this.setState({ curDragging: newState.curDragging });
    }

    const uuid = this.state.clientUUID;
    const myClient = Object.assign({}, this.state.otherUsers,
      {
        uuid:
        {
          x: this.state.windowX - (window.innerWidth / 2),
          y: this.state.windowY - (window.innerHeight / 2),
          color: this.state.clientColor,
        },
      },
    );

    origState[uuidVal].state = updatedState;
    this.setState({
      boxes: origState,
    });

    // Push the update out over WebSockets
    this.io.sendUpdateMessage({
      // eslint-disable-next-line
      zIndex: this.state.zIndex,
      // eslint-disable-next-line no-underscore-dangle
      boardId: this.props.data._id,
      uuid: uuidVal,
      state: updatedState,
      type: origState[uuidVal].type,
      clients: myClient,
    });
  };

  /**
   * Increments the highest z-index for the board.
   * @return {number} zIndex: the current board z-index
  */
  updateZ = () => {
    this.setState({
      zIndex: this.state.zIndex + 1,
    });
    return this.state.zIndex;
  };

  /**
   * Updates the text value for a given text box.
   * @param uuid - the UUID of the text box to be updated.
   * @param textVal - the text to put in the text box.
  */
  updateText = (uuid, textVal) => {
    this.updateBoardState(uuid, { text: textVal });
  };

  /**
  * Handles the clicking of the box generation buttons.
  */
  handleButtonClick = (boxType) => {
    if (boxType === 'image') {
      this.input.click(); // Manually bring up file dialog
    } else {
      this.generateBox(boxType);
    }
  };

  /**
   * Handles the movement of the board view window.
  */
  dragWindow = (e) => {
    if (this.state.dragging) {
      const curX = this.state.windowX;
      const curY = this.state.windowY;
      this.setState({
        windowX: curX + (e.clientX - this.state.prevX),
        windowY: curY + (e.clientY - this.state.prevY),
      });
      this.setState({
        prevX: e.clientX,
        prevY: e.clientY,
      });
    }
  };

  /**
   * Updates the board state to allow window movement on mouse press.
  */
  mouseDown = (e) => {
    // Only drag on middle mouse, or when not over a box
    if (e.button === 1 || e.target === this.view) {
      this.setState({
        dragging: true,
        prevX: e.clientX,
        prevY: e.clientY,
        cursor: 'move',
      });
    }
  };

  /**
   * Stops movement of the board window.
  */
  mouseUp = () => {
    this.setState({ dragging: false, cursor: 'default' });
  };


  /**
   * Generates a box based on a button click event.
   * @param boxType: the type of box to generate.
  */
  generateBox = (boxType, sourceURL, isUpload) => {
    const uuid = uuidv4(); // Gen unique UUID
    const initState = this.state.boxes;
    const stateObject = {
      x: 50 - this.state.windowX,
      y: 50 - this.state.windowY,
      w: 200,
      h: 200,
      z: this.state.zIndex,
      color: randomColor(),
      text: '',
      src: sourceURL,
    };

    initState[uuid] = {
      type: boxType,
      state: stateObject,
    };

    if (isUpload) { // Set the prop for this box so it resizes on load
      initState[uuid] = Object.assign({}, initState[uuid], { isUpload: true });
    }
    this.setState({ boxes: initState });
    this.updateBoardState(uuid, stateObject);
  };


  /**
   * Called on ImageBox load to resize image correctly
   * @param uuid: the UUID of the box
   * @param w: the new width of the box
   * @param h: the new height of the box
  */
  updateImage = (uuid, w, h, isUpload) => {
    const initState = this.state.boxes;
    initState[uuid].aspect = w / h; // Track the aspect ratio
    if (isUpload) { // If it's a newly uploaded picture, update the size
      if (w > 500) { // Bound the initial render size to 500x500 to avoid huge images
        initState[uuid].state.w = 500;
        initState[uuid].state.h = initState[uuid].state.w / initState[uuid].aspect;
      } else if (h > 500) {
        initState[uuid].state.h = 500;
        initState[uuid].state.w = initState[uuid].state.h * initState[uuid].aspect;
      } else {
        initState[uuid].state.h = h; // Otherwise, set based on aspect ratio
        initState[uuid].state.w = initState[uuid].state.h * initState[uuid].aspect;
      }
    }

    this.setState({ boxes: initState });
  };

  render() {
    const allClients = Object.keys(this.state.otherUsers);
    const clientBoxes = [];
    for (let i = 0; i < allClients.length; i++) {
      const curKey = allClients[i];
      const xVal = -this.state.otherUsers[curKey].x + this.state.windowX;
      const yVal = -this.state.otherUsers[curKey].y + this.state.windowY;
      const clientStyle = ({ left: xVal, top: yVal, zIndex: this.state.zIndex + 2, backgroundColor: this.state.otherUsers[curKey].color });
      clientBoxes.push(<div className="Client-box" key={curKey} style={clientStyle} />)
    }


    const allKeys = Object.keys(this.state.boxes);
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const curKey = allKeys[i];
      const propsIn = {
        key: curKey,
        clickCallback: this.updateZ,
        uuid: curKey,
        renderX: this.state.boxes[curKey].state.x + this.state.windowX,
        renderY: this.state.boxes[curKey].state.y + this.state.windowY,
        callback: this.updateBoardState,
        isUpload: this.state.boxes[curKey].isUpload,
        deleteCallback: this.handleDelete,
        overDelete: this.state.onDelete,
      };

      if (this.state.onDelete && curKey === this.state.curDragging) {
        propsIn.opacity = 0.6;
      }

      const stateProps = Object.assign(
        {},
        propsIn,
        this.state.boxes[curKey].state,
      ); // Add in state props

      // If there is an aspect ratio, add that to the box state as well
      if (typeof this.state.boxes[curKey].aspect !== 'undefined') {
        stateProps.aspect = this.state.boxes[curKey].aspect;
      }
      if (!this.state.boxes[curKey].unMount) {
        if (this.state.boxes[curKey].type === 'text') {
          boxes.push(<TextBox editCallback={this.updateText} {...stateProps} />);
        } else if (this.state.boxes[curKey].type === 'image') {
          boxes.push(<ImageBox
            imgCallback={this.updateImage}
            {...stateProps}
          />);
        }
      }
    }
    const buttonStyle = { zIndex: this.state.zIndex + 1 };

    const bgStyle = { // Set the position for the grid background
      // eslint-disable-next-line
      backgroundPosition: String(this.state.windowX % 50) + 'px ' +  String(this.state.windowY % 50) + 'px',
    };

    return (
      // eslint-disable-next-line
      <div className="View"
        onMouseMove={this.dragWindow}
        onMouseUp={this.mouseUp}
        style={{ cursor: this.state.cursor }}
      >
        {clientBoxes}
        {boxes}
        <div className="View" style={bgStyle} id="bg" ref={(view) => { this.view = view; }} />
        <FileDragger generateBox={this.generateBox} inputFile={this.inputFile} />
        <div className="Button-wrapper" style={buttonStyle}>
          <div className="Box-button">
            <button className="Box-button" onClick={() => { this.setState({ windowX: 0, windowY: 0 }); }}>
              <i className="fa fa-home" />
            </button>
          </div>
          <div className="Box-button" style={buttonStyle}>
            <button className="Box-button text" onClick={() => this.handleButtonClick('text')} >
              <i className="fa fa-font" data-type="text" />
            </button>
          </div>
          <div className="Box-button" style={buttonStyle}>
            <button className="Box-button image" onClick={() => this.handleButtonClick('image')} >
              <i className="fa fa-image" />
            </button>

            <ReactS3Uploader
              signingUrl="/s3/sign"
              signingUrlMethod="GET"
              accept="image/*"
              onFinish={this.onUploadFinish}
              uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }} // this is the default
              // eslint-disable-next-line
              server={window.SERVER_URI}
              inputRef={(input) => { this.input = input; }}
              style={{ display: 'none' }}
            />
          </div>
          <div className="Box-button" style={buttonStyle}>
            <button
              className="Box-button trash"
              onMouseEnter={() => this.setState({ onDelete: true })}
              onMouseLeave={() => this.setState({ onDelete: false })}
            >
              <i className="fa fa-trash" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};

export default Board;
